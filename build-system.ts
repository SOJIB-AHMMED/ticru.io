#!/usr/bin/env node

/**
 * Ticru.io Build System
 * Automates the build, test, and deployment process
 */

import { execSync, ExecException } from 'child_process';
import { existsSync, writeFileSync, rmSync } from 'fs';
import { Command } from 'commander';

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

function printHeader(message: string): void {
  console.log(`\n${Colors.HEADER}${Colors.BOLD}${'='.repeat(60)}${Colors.ENDC}`);
  console.log(`${Colors.HEADER}${Colors.BOLD}${message}${Colors.ENDC}`);
  console.log(`${Colors.HEADER}${Colors.BOLD}${'='.repeat(60)}${Colors.ENDC}\n`);
}

function printSuccess(message: string): void {
  console.log(`${Colors.OKGREEN}✓ ${message}${Colors.ENDC}`);
}

function printError(message: string): void {
  console.log(`${Colors.FAIL}✗ ${message}${Colors.ENDC}`);
}

function printInfo(message: string): void {
  console.log(`${Colors.OKCYAN}ℹ ${message}${Colors.ENDC}`);
}

function runCommand(command: string, check: boolean = true): boolean {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    const e = error as ExecException;
    printError(`Command failed: ${command}`);
    if (e.stderr) {
      printError(`Error: ${e.stderr}`);
    }
    if (check) {
      process.exit(1);
    }
    return false;
  }
}

function checkDependencies(): boolean {
  printHeader('Checking Dependencies');

  const dependencies = {
    node: 'node --version',
    npm: 'npm --version',
    git: 'git --version',
  };

  let allOk = true;
  for (const [name, command] of Object.entries(dependencies)) {
    try {
      const version = execSync(command, { encoding: 'utf-8' }).trim();
      printSuccess(`${name}: ${version}`);
    } catch (error) {
      printError(`${name}: Not found`);
      allOk = false;
    }
  }

  return allOk;
}

function installNpmDependencies(): boolean {
  printHeader('Installing NPM Dependencies');
  printInfo('Running npm install...');
  const success = runCommand('npm install');
  if (success) {
    printSuccess('NPM dependencies installed successfully');
  }
  return success;
}

function lintCode(): boolean {
  printHeader('Linting Code');

  if (existsSync('package.json')) {
    printInfo('Running ESLint...');
    const success = runCommand('npm run lint', false);
    if (success) {
      printSuccess('JavaScript/TypeScript linting passed');
    } else {
      printError('JavaScript/TypeScript linting failed');
      return false;
    }
  }

  return true;
}

function typeCheck(): boolean {
  printHeader('Type Checking');

  if (existsSync('tsconfig.json')) {
    printInfo('Running TypeScript type check...');
    const success = runCommand('npm run type-check', false);
    if (success) {
      printSuccess('Type checking passed');
    } else {
      printError('Type checking failed');
      return false;
    }
  }

  return true;
}

function buildFrontend(): boolean {
  printHeader('Building Frontend');
  printInfo('Running production build...');
  const success = runCommand('npm run build');
  if (success) {
    printSuccess('Frontend built successfully');

    // Check build output
    if (existsSync('dist')) {
      const files = require('fs').readdirSync('dist', { recursive: true });
      printSuccess(`Build output: ${files.length} files in dist/`);
    }

    return true;
  }
  return false;
}

function buildApi(): boolean {
  printHeader('Building API Server');
  printInfo('Compiling TypeScript API...');
  const success = runCommand('npm run build:api');
  if (success) {
    printSuccess('API server built successfully');
    return true;
  }
  return false;
}

function testCode(): boolean {
  printHeader('Running Tests');
  printInfo('Tests not configured yet');
  return true;
}

function generateBuildInfo(): boolean {
  printHeader('Generating Build Info');

  try {
    const gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim();

    const buildInfo = {
      version: '1.0.0',
      build_date: new Date().toISOString(),
      git_commit: gitCommit,
      git_branch: gitBranch,
    };

    if (existsSync('dist')) {
      writeFileSync('dist/build-info.json', JSON.stringify(buildInfo, null, 2));
      printSuccess('Build info generated: dist/build-info.json');
    }

    return true;
  } catch (error) {
    printError('Failed to generate build info');
    return false;
  }
}

function cleanBuild(): boolean {
  printHeader('Cleaning Build Artifacts');

  const pathsToClean = ['dist', 'build', 'node_modules/.cache'];

  for (const path of pathsToClean) {
    if (existsSync(path)) {
      printInfo(`Removing ${path}...`);
      rmSync(path, { recursive: true, force: true });
      printSuccess(`Removed ${path}`);
    }
  }

  return true;
}

async function main() {
  const program = new Command();

  program
    .name('build-system')
    .description('Ticru.io Build System')
    .option('--clean', 'Clean build artifacts')
    .option('--install', 'Install dependencies')
    .option('--lint', 'Run linting')
    .option('--type-check', 'Run type checking')
    .option('--build', 'Build the application')
    .option('--build-api', 'Build the API server')
    .option('--test', 'Run tests')
    .option('--all', 'Run complete build pipeline');

  program.parse();

  const options = program.opts();

  // If no specific action, run all
  if (
    !options.clean &&
    !options.install &&
    !options.lint &&
    !options.typeCheck &&
    !options.build &&
    !options.buildApi &&
    !options.test &&
    !options.all
  ) {
    options.all = true;
  }

  const startTime = Date.now();
  printHeader(`Ticru.io Build System - ${new Date().toLocaleString()}`);

  let success = true;

  // Check dependencies first
  if (!checkDependencies()) {
    printError('Missing required dependencies');
    process.exit(1);
  }

  // Execute requested actions
  if (options.clean || options.all) {
    success = success && cleanBuild();
  }

  if (options.install || options.all) {
    success = success && installNpmDependencies();
  }

  if (options.lint || options.all) {
    success = success && lintCode();
  }

  if (options.typeCheck || options.all) {
    success = success && typeCheck();
  }

  if (options.build || options.all) {
    success = success && buildFrontend();
    if (success) {
      success = success && generateBuildInfo();
    }
  }

  if (options.buildApi || options.all) {
    success = success && buildApi();
  }

  if (options.test || options.all) {
    success = success && testCode();
  }

  // Summary
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;

  printHeader('Build Summary');
  console.log(`Duration: ${duration.toFixed(2)} seconds`);

  if (success) {
    printSuccess('Build completed successfully!');
    process.exit(0);
  } else {
    printError('Build failed!');
    process.exit(1);
  }
}

main().catch((error) => {
  printError(`Build system error: ${error.message}`);
  process.exit(1);
});
