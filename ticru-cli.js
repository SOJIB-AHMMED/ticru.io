#!/usr/bin/env node

/**
 * Ticru.io CLI Tool
 * Command-line interface for managing the Ticru.io application
 */

import { Command } from 'commander';
import { spawn } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name('ticru-cli')
  .description('Ticru.io Command Line Interface')
  .version('1.0.0');

program
  .command('serve')
  .description('Start the API server')
  .option('-p, --port <port>', 'Port to run the server on', '8000')
  .option('-h, --host <host>', 'Host to bind to', '0.0.0.0')
  .action((options) => {
    console.log(`🚀 Starting Ticru.io API server on ${options.host}:${options.port}`);
    
    const env = {
      ...process.env,
      PORT: options.port,
      HOST: options.host,
    };
    
    const serverProcess = spawn('npm', ['run', 'api:dev'], {
      stdio: 'inherit',
      shell: true,
      env,
    });
    
    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  });

program
  .command('dev')
  .description('Start the development server')
  .option('-p, --port <port>', 'Port to run the dev server on', '5173')
  .action((options) => {
    console.log(`🔧 Starting development server on port ${options.port}`);
    
    const devProcess = spawn('npm', ['run', 'dev', '--', '--port', options.port], {
      stdio: 'inherit',
      shell: true,
    });
    
    devProcess.on('error', (err) => {
      console.error('Failed to start dev server:', err);
      process.exit(1);
    });
  });

program
  .command('run')
  .description('Start both frontend and backend servers concurrently')
  .option('--frontend-port <port>', 'Port for the frontend dev server', '5173')
  .option('--backend-port <port>', 'Port for the backend API server', '8000')
  .option('--backend-host <host>', 'Host for the backend server', '0.0.0.0')
  .action((options) => {
    console.log('🚀 Starting Ticru.io Application');
    console.log('='.repeat(60));
    console.log(`  Frontend Dev Server: http://localhost:${options.frontendPort}`);
    console.log(`  Backend API Server:  http://${options.backendHost}:${options.backendPort}`);
    console.log('='.repeat(60));
    console.log('\nPress Ctrl+C to stop both servers\n');
    
    // Start backend server
    const backendEnv = {
      ...process.env,
      PORT: options.backendPort,
      HOST: options.backendHost,
    };
    
    const backendProcess = spawn('npm', ['run', 'api:dev'], {
      stdio: 'inherit',
      shell: true,
      env: backendEnv,
    });
    
    // Start frontend server
    const frontendProcess = spawn('npm', ['run', 'dev', '--', '--port', options.frontendPort], {
      stdio: 'inherit',
      shell: true,
    });
    
    // Handle graceful shutdown
    const cleanup = () => {
      console.log('\n\n🛑 Shutting down servers...');
      backendProcess.kill();
      frontendProcess.kill();
      console.log('✅ Servers stopped');
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    backendProcess.on('error', (err) => {
      console.error('Backend error:', err);
    });
    
    frontendProcess.on('error', (err) => {
      console.error('Frontend error:', err);
    });
  });

program
  .command('build')
  .description('Build the application for production')
  .action(() => {
    console.log('🏗️  Building application...');
    
    const buildProcess = spawn('node', ['build-system.js', '--all'], {
      stdio: 'inherit',
      shell: true,
    });
    
    buildProcess.on('error', (err) => {
      console.error('Build failed:', err);
      process.exit(1);
    });
    
    buildProcess.on('exit', (code) => {
      process.exit(code || 0);
    });
  });

program
  .command('install')
  .description('Install all dependencies')
  .action(() => {
    console.log('📦 Installing dependencies...');
    console.log('\n→ Installing npm dependencies...');
    
    const npmProcess = spawn('npm', ['install'], {
      stdio: 'inherit',
      shell: true,
    });
    
    npmProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('\n✅ Dependencies installed successfully!');
      } else {
        console.error('\n❌ Failed to install dependencies');
        process.exit(code || 1);
      }
    });
  });

program
  .command('test')
  .description('Run all tests')
  .action(() => {
    console.log('🧪 Running tests...');
    console.log('⚠️  Tests not configured yet');
  });

program
  .command('lint')
  .description('Run code linting')
  .action(() => {
    console.log('🔍 Running linters...');
    
    const lintProcess = spawn('npm', ['run', 'lint'], {
      stdio: 'inherit',
      shell: true,
    });
    
    lintProcess.on('exit', (code) => {
      process.exit(code || 0);
    });
  });

program
  .command('init-db')
  .description('Initialize the database')
  .option('--sql-file <file>', 'SQL file to execute', 'BUILD-DATABASE.sql')
  .action((options) => {
    console.log(`🗄️  Initializing database from ${options.sqlFile}`);
    
    if (!existsSync(options.sqlFile)) {
      console.error(`❌ Error: ${options.sqlFile} not found`);
      process.exit(1);
    }
    
    const dbUrl = process.env.DATABASE_URL || 'postgresql://localhost/ticru_db';
    console.log(`Database URL: ${dbUrl}`);
    
    const psqlProcess = spawn('psql', [dbUrl, '-f', options.sqlFile], {
      stdio: 'inherit',
      shell: true,
    });
    
    psqlProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Database initialized successfully!');
      } else {
        console.error('❌ Failed to initialize database');
        console.error('Make sure PostgreSQL is running and DATABASE_URL is set correctly');
        process.exit(code || 1);
      }
    });
  });

program
  .command('clean')
  .description('Clean build artifacts')
  .action(() => {
    console.log('🧹 Cleaning build artifacts...');
    
    const paths = ['dist', 'build', 'node_modules/.cache'];
    
    const cleanProcess = spawn('rm', ['-rf', ...paths], {
      stdio: 'inherit',
      shell: true,
    });
    
    cleanProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Cleanup complete!');
      }
    });
  });

program
  .command('deploy')
  .description('Deploy to production')
  .requiredOption('-p, --platform <platform>', 'Platform to deploy to (vercel or netlify)')
  .action((options) => {
    console.log(`🚀 Deploying to ${options.platform}...`);
    
    let deployProcess;
    
    if (options.platform === 'vercel') {
      if (!existsSync('deploy-vercel.sh')) {
        console.error('❌ deploy-vercel.sh not found');
        process.exit(1);
      }
      deployProcess = spawn('bash', ['deploy-vercel.sh'], {
        stdio: 'inherit',
        shell: true,
      });
    } else if (options.platform === 'netlify') {
      deployProcess = spawn('netlify', ['deploy', '--prod'], {
        stdio: 'inherit',
        shell: true,
      });
    } else {
      console.error('❌ Unknown platform. Use "vercel" or "netlify"');
      process.exit(1);
    }
    
    deployProcess.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Deployment complete!');
      } else {
        console.error('❌ Deployment failed');
        process.exit(code || 1);
      }
    });
  });

program
  .command('setup')
  .description('Run the complete setup wizard')
  .action(async () => {
    console.log('🎯 Ticru.io Setup Wizard');
    console.log('='.repeat(50));
    
    // Check Node.js
    console.log('\n1. Checking Node.js...');
    const nodeCheck = spawn('node', ['--version'], {
      stdio: ['inherit', 'pipe', 'inherit'],
      shell: true,
    });
    
    nodeCheck.stdout.on('data', (data) => {
      console.log(`   ✅ Node.js ${data.toString().trim()}`);
    });
    
    await new Promise((resolve) => nodeCheck.on('exit', resolve));
    
    // Install dependencies
    console.log('\n2. Installing dependencies...');
    const installProcess = spawn('npm', ['install'], {
      stdio: 'inherit',
      shell: true,
    });
    
    await new Promise((resolve) => {
      installProcess.on('exit', (code) => {
        if (code === 0) {
          console.log('   ✅ Dependencies installed');
        }
        resolve(code);
      });
    });
    
    // Create .env if not exists
    console.log('\n3. Setting up environment...');
    if (!existsSync('.env') && existsSync('.env.example')) {
      copyFileSync('.env.example', '.env');
      console.log('   ✅ Created .env file');
    } else {
      console.log('   ✅ Environment already configured');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Setup complete!');
    console.log('\nNext steps:');
    console.log('  • Run \'node ticru-cli.js dev\' to start development server');
    console.log('  • Run \'node ticru-cli.js serve\' to start API server');
    console.log('  • Run \'node ticru-cli.js build\' to build for production');
  });

program
  .command('status')
  .description('Show application status')
  .action(async () => {
    console.log('📊 Ticru.io Status');
    console.log('='.repeat(50));
    
    console.log('\nServer Status:');
    
    // Check API server
    try {
      const response = await fetch('http://localhost:8000/api/health', {
        signal: AbortSignal.timeout(2000),
      });
      
      if (response.ok) {
        console.log('  API Server: ✅ Running (port 8000)');
      } else {
        console.log('  API Server: ⚠️  Unhealthy');
      }
    } catch (err) {
      console.log('  API Server: ❌ Not running');
    }
    
    // Check dev server
    try {
      const response = await fetch('http://localhost:5173', {
        signal: AbortSignal.timeout(2000),
      });
      
      if (response.ok) {
        console.log('  Dev Server: ✅ Running (port 5173)');
      } else {
        console.log('  Dev Server: ⚠️  Unhealthy');
      }
    } catch (err) {
      console.log('  Dev Server: ❌ Not running');
    }
    
    // Build status
    console.log('\nBuild Status:');
    if (existsSync('dist')) {
      console.log('  Build Output: ✅ Built');
    } else {
      console.log('  Build Output: ❌ Not built');
    }
    
    // Dependencies
    console.log('\nDependencies:');
    if (existsSync('node_modules')) {
      console.log('  NPM Packages: ✅ Installed');
    } else {
      console.log('  NPM Packages: ❌ Not installed');
    }
  });

program.parse();
