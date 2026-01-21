#!/usr/bin/env node

/**
 * Ticru.io Build System
 * Automates the build, test, and deployment process
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { parseArgs } from 'util';

// ANSI color codes
const Colors = {
  HEADER: '\x1b[95m',
  OKBLUE: '\x1b[94m',
  OKCYAN: '\x1b[96m',
  OKGREEN: '\x1b[92m',
  WARNING: '\x1b[93m',
  FAIL: '\x1b[91m',
  ENDC: '\x1b[0m',
  BOLD: '\x1b[1m',
};

function printHeader(message) {
  console.log(`\n${Colors.HEADER}${Colors.BOLD}${'='.repeat(60)}${Colors.ENDC}`);
  console.log(`${Colors.HEADER}${Colors.BOLD}${message}${Colors.ENDC}`);
  console.log(`${Colors.HEADER}${Colors.BOLD}${'='.repeat(60)}${Colors.ENDC}\n`);
}

function printSuccess(message) {
  console.log(`${Colors.OKGREEN}✓ ${message}${Colors.ENDC}`);
}

function printError(message) {
  console.log(`${Colors.FAIL}✗ ${message}${Colors.ENDC}`);
}

function printInfo(message) {
  console.log(`${Colors.OKCYAN}ℹ ${message}${Colors.ENDC}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    if (options.check !== false) {
      printError(`Command failed: ${command}`);
      if (error.stderr) {
        printError(`Error: ${error.stderr}`);
      }
      if (options.exitOnError !== false) {
        process.exit(1);
      }
    }
    return { success: false, error };
  }
}

function checkDependencies() {
  printHeader('Checking Dependencies');
  
  const dependencies = {
    node: 'node --version',
    npm: 'npm --version',
    git: 'git --version',
  };
  
  let allOk = true;
  
  for (const [name, command] of Object.entries(dependencies)) {
    const result = runCommand(command, { silent: true, check: false, exitOnError: false });
    
    if (result.success) {
      const version = result.output.trim();
      printSuccess(`${name}: ${version}`);
    } else {
      printError(`${name}: Not found`);
      allOk = false;
    }
  }
  
  return allOk;
}

function installNpmDependencies() {
  printHeader('Installing NPM Dependencies');
  printInfo('Running npm install...');
  
  const result = runCommand('npm install', { exitOnError: false });
  
  if (result.success) {
    printSuccess('NPM dependencies installed successfully');
    return true;
  }
  
  return false;
}

function lintCode() {
  printHeader('Linting Code');
  
  if (existsSync('package.json')) {
    printInfo('Running ESLint...');
    const result = runCommand('npm run lint', { check: false, exitOnError: false });
    
    if (result.success) {
      printSuccess('JavaScript/TypeScript linting passed');
      return true;
    } else {
      printError('JavaScript/TypeScript linting failed');
      return false;
    }
  }
  
  return true;
}

function typeCheck() {
  printHeader('Type Checking');
  
  if (existsSync('tsconfig.json')) {
    printInfo('Running TypeScript type check...');
    const result = runCommand('npm run type-check', { check: false, exitOnError: false });
    
    if (result.success) {
      printSuccess('Type checking passed');
      return true;
    } else {
      printError('Type checking failed');
      return false;
    }
  }
  
  return true;
}

function buildFrontend() {
  printHeader('Building Frontend');
  printInfo('Running production build...');
  
  const result = runCommand('npm run build', { exitOnError: false });
  
  if (result.success) {
    printSuccess('Frontend built successfully');
    
    // Check build output
    if (existsSync('dist')) {
      const files = countFiles('dist');
      printSuccess(`Build output: ${files} files in dist/`);
    }
    
    return true;
  }
  
  return false;
}

function countFiles(dir) {
  let count = 0;
  
  function walk(directory) {
    const files = readdirSync(directory);
    
    for (const file of files) {
      const filePath = join(directory, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        walk(filePath);
      } else {
        count++;
      }
    }
  }
  
  walk(dir);
  return count;
}

function testCode() {
  printHeader('Running Tests');
  printInfo('Tests not configured yet');
  return true;
}

function generateBuildInfo() {
  printHeader('Generating Build Info');
  
  const buildInfo = {
    version: '1.0.0',
    build_date: new Date().toISOString(),
    git_commit: '',
    git_branch: '',
  };
  
  try {
    buildInfo.git_commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    buildInfo.git_branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch (err) {
    // Ignore git errors
  }
  
  if (existsSync('dist')) {
    import('fs').then(fs => {
      fs.writeFileSync('dist/build-info.json', JSON.stringify(buildInfo, null, 2));
      printSuccess('Build info generated: dist/build-info.json');
    });
  }
  
  return true;
}

function cleanBuild() {
  printHeader('Cleaning Build Artifacts');
  
  const pathsToClean = ['dist', 'build', 'node_modules/.cache'];
  
  for (const path of pathsToClean) {
    if (existsSync(path)) {
      printInfo(`Removing ${path}...`);
      runCommand(`rm -rf ${path}`, { check: false });
      printSuccess(`Removed ${path}`);
    }
  }
  
  return true;
}

async function main() {
  const { values: args } = parseArgs({
    options: {
      clean: { type: 'boolean', default: false },
      install: { type: 'boolean', default: false },
      lint: { type: 'boolean', default: false },
      'type-check': { type: 'boolean', default: false },
      build: { type: 'boolean', default: false },
      test: { type: 'boolean', default: false },
      all: { type: 'boolean', default: false },
    },
    strict: false,
  });
  
  // If no specific action, run all
  const runAll = args.all || (!args.clean && !args.install && !args.lint && !args['type-check'] && !args.build && !args.test);
  
  const startTime = Date.now();
  printHeader(`Ticru.io Build System - ${new Date().toLocaleString()}`);
  
  let success = true;
  
  // Check dependencies first
  if (!checkDependencies()) {
    printError('Missing required dependencies');
    process.exit(1);
  }
  
  // Execute requested actions
  if (args.clean || runAll) {
    success = success && cleanBuild();
  }
  
  if (args.install || runAll) {
    success = success && installNpmDependencies();
  }
  
  if (args.lint || runAll) {
    success = success && lintCode();
  }
  
  if (args['type-check'] || runAll) {
    success = success && typeCheck();
  }
  
  if (args.build || runAll) {
    success = success && buildFrontend();
    if (success) {
      success = success && generateBuildInfo();
    }
  }
  
  if (args.test || runAll) {
    success = success && testCode();
  }
  
  // Summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  printHeader('Build Summary');
  console.log(`Duration: ${duration} seconds`);
  
  if (success) {
    printSuccess('Build completed successfully!');
    process.exit(0);
  } else {
    printError('Build failed!');
    process.exit(1);
  }
}

main();
