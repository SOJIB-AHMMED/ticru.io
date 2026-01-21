#!/usr/bin/env node

/**
 * Ticru.io CLI Tool
 * Command-line interface for managing the Ticru.io application
 */

import { Command } from 'commander';
import { spawn, ChildProcess } from 'child_process';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync, rmSync } from 'fs';
import { execSync } from 'child_process';

// Load environment variables
config();

const program = new Command();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Package version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf-8')
);

program
  .name('ticru-cli')
  .description('Ticru.io Command Line Interface')
  .version(packageJson.version || '1.0.0');

/**
 * Start the API server
 */
program
  .command('serve')
  .description('Start the API server')
  .option('-p, --port <port>', 'Port to run the server on', '8000')
  .option('-h, --host <host>', 'Host to bind to', '0.0.0.0')
  .action((options) => {
    console.log(`🚀 Starting Ticru.io API server on ${options.host}:${options.port}`);

    const env = { ...process.env, PORT: options.port, HOST: options.host };

    spawn('npm', ['run', 'dev:api'], {
      stdio: 'inherit',
      shell: true,
      env,
    });
  });

/**
 * Start the development server
 */
program
  .command('dev')
  .description('Start the development server')
  .option('-p, --port <port>', 'Port to run the dev server on', '5173')
  .action((options) => {
    console.log(`🔧 Starting development server on port ${options.port}`);

    spawn('npm', ['run', 'dev', '--', '--port', options.port], {
      stdio: 'inherit',
      shell: true,
    });
  });

/**
 * Start both frontend and backend servers concurrently
 */
program
  .command('run')
  .description('Start both frontend and backend servers concurrently')
  .option('-fp, --frontend-port <port>', 'Port for the frontend dev server', '5173')
  .option('-bp, --backend-port <port>', 'Port for the backend API server', '8000')
  .option('-bh, --backend-host <host>', 'Host for the backend server', '0.0.0.0')
  .action((options) => {
    console.log('🚀 Starting Ticru.io Application');
    console.log('='.repeat(60));
    console.log(`  Frontend Dev Server: http://localhost:${options.frontendPort}`);
    console.log(`  Backend API Server:  http://${options.backendHost}:${options.backendPort}`);
    console.log('='.repeat(60));
    console.log('\nPress Ctrl+C to stop both servers\n');

    const processes: ChildProcess[] = [];

    // Start backend server
    const backendEnv = {
      ...process.env,
      PORT: options.backendPort,
      HOST: options.backendHost,
    };

    const backend = spawn('npm', ['run', 'dev:api'], {
      stdio: 'inherit',
      shell: true,
      env: backendEnv,
    });
    processes.push(backend);

    // Start frontend server
    const frontend = spawn('npm', ['run', 'dev', '--', '--port', options.frontendPort], {
      stdio: 'inherit',
      shell: true,
    });
    processes.push(frontend);

    // Handle graceful shutdown
    const shutdown = () => {
      console.log('\n\n🛑 Shutting down servers...');
      processes.forEach((proc) => {
        if (proc && !proc.killed) {
          proc.kill('SIGTERM');
        }
      });

      setTimeout(() => {
        processes.forEach((proc) => {
          if (proc && !proc.killed) {
            proc.kill('SIGKILL');
          }
        });
        console.log('✅ Servers stopped');
        process.exit(0);
      }, 5000);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  });

/**
 * Build the application for production
 */
program
  .command('build')
  .description('Build the application for production')
  .action(() => {
    console.log('🏗️  Building application...');
    try {
      execSync('node build-system.ts --all', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Build failed');
      process.exit(1);
    }
  });

/**
 * Install all dependencies
 */
program
  .command('install')
  .description('Install all dependencies')
  .action(() => {
    console.log('📦 Installing dependencies...');
    console.log('\n→ Installing npm dependencies...');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✅ Dependencies installed successfully!');
    } catch (error) {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });

/**
 * Run all tests
 */
program
  .command('test')
  .description('Run all tests')
  .action(() => {
    console.log('🧪 Running tests...');
    console.log('⚠️  Tests not configured yet');
  });

/**
 * Run code linting
 */
program
  .command('lint')
  .description('Run code linting')
  .action(() => {
    console.log('🔍 Running linters...');
    try {
      execSync('npm run lint', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Linting failed');
      process.exit(1);
    }
  });

/**
 * Initialize the database
 */
program
  .command('init-db')
  .description('Initialize the database')
  .option('-f, --sql-file <file>', 'SQL file to execute', 'BUILD-DATABASE.sql')
  .action((options) => {
    console.log(`🗄️  Initializing database from ${options.sqlFile}`);

    if (!existsSync(options.sqlFile)) {
      console.error(`❌ Error: ${options.sqlFile} not found`);
      process.exit(1);
    }

    const dbUrl = process.env.DATABASE_URL || 'postgresql://localhost/ticru_db';
    console.log(`Database URL: ${dbUrl}`);

    try {
      execSync(`psql ${dbUrl} -f ${options.sqlFile}`, { stdio: 'inherit' });
      console.log('✅ Database initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize database');
      console.error('Make sure PostgreSQL is running and DATABASE_URL is set correctly');
      process.exit(1);
    }
  });

/**
 * Clean build artifacts
 */
program
  .command('clean')
  .description('Clean build artifacts')
  .action(() => {
    console.log('🧹 Cleaning build artifacts...');

    const paths = ['dist', 'build', 'node_modules/.cache'];

    paths.forEach((path) => {
      if (existsSync(path)) {
        rmSync(path, { recursive: true, force: true });
        console.log(`  Removed ${path}`);
      }
    });

    console.log('✅ Cleanup complete!');
  });

/**
 * Deploy to production
 */
program
  .command('deploy')
  .description('Deploy to production')
  .requiredOption('-p, --platform <platform>', 'Deployment platform (vercel or netlify)')
  .action((options) => {
    console.log(`🚀 Deploying to ${options.platform}...`);

    if (options.platform === 'vercel') {
      if (!existsSync('deploy-vercel.sh')) {
        console.error('❌ deploy-vercel.sh not found');
        process.exit(1);
      }
      try {
        execSync('bash deploy-vercel.sh', { stdio: 'inherit' });
        console.log('✅ Deployment complete!');
      } catch (error) {
        console.error('❌ Deployment failed');
        process.exit(1);
      }
    } else if (options.platform === 'netlify') {
      try {
        execSync('netlify deploy --prod', { stdio: 'inherit' });
        console.log('✅ Deployment complete!');
      } catch (error) {
        console.error('❌ Deployment failed');
        process.exit(1);
      }
    } else {
      console.error(`❌ Unknown platform: ${options.platform}`);
      process.exit(1);
    }
  });

/**
 * Run the complete setup wizard
 */
program
  .command('setup')
  .description('Run the complete setup wizard')
  .action(() => {
    console.log('🎯 Ticru.io Setup Wizard');
    console.log('='.repeat(50));

    // Check Node.js
    console.log('\n1. Checking Node.js...');
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
      console.log(`   ✅ Node.js ${nodeVersion}`);
    } catch (error) {
      console.log('   ❌ Node.js not found');
      process.exit(1);
    }

    // Install dependencies
    console.log('\n2. Installing dependencies...');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('   ✅ Dependencies installed');
    } catch (error) {
      console.error('   ❌ Failed to install dependencies');
      process.exit(1);
    }

    // Create .env if not exists
    console.log('\n3. Setting up environment...');
    if (!existsSync('.env') && existsSync('.env.example')) {
      try {
        const envExample = readFileSync('.env.example', 'utf-8');
        require('fs').writeFileSync('.env', envExample);
        console.log('   ✅ Created .env file');
        console.log('   ⚠️  Please edit .env and add your configuration');
      } catch (error) {
        console.error('   ❌ Failed to create .env file');
      }
    } else {
      console.log('   ✅ Environment already configured');
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Setup complete!');
    console.log('\nNext steps:');
    console.log('  • Run \'npm run cli dev\' to start development server');
    console.log('  • Run \'npm run cli serve\' to start API server');
    console.log('  • Run \'npm run cli build\' to build for production');
  });

/**
 * Show application status
 */
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
    } catch (error) {
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
    } catch (error) {
      console.log('  Dev Server: ❌ Not running');
    }

    // Build status
    console.log('\nBuild Status:');
    if (existsSync('dist')) {
      const files = require('fs').readdirSync('dist', { recursive: true });
      console.log(`  Build Output: ✅ ${files.length} files`);
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
