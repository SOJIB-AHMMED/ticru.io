#!/usr/bin/env python3
"""
Ticru.io Build System
Automates the build, test, and deployment process
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path
from datetime import datetime

class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(message):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{message}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(message):
    print(f"{Colors.OKGREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.FAIL}✗ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.OKCYAN}ℹ {message}{Colors.ENDC}")

def run_command(command, check=True):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=check,
            capture_output=True,
            text=True
        )
        return result
    except subprocess.CalledProcessError as e:
        print_error(f"Command failed: {command}")
        print_error(f"Error: {e.stderr}")
        if check:
            sys.exit(1)
        return e

def check_dependencies():
    """Check if required dependencies are installed"""
    print_header("Checking Dependencies")
    
    dependencies = {
        'node': 'node --version',
        'npm': 'npm --version',
        'python3': 'python3 --version',
        'git': 'git --version'
    }
    
    all_ok = True
    for name, command in dependencies.items():
        result = run_command(command, check=False)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_success(f"{name}: {version}")
        else:
            print_error(f"{name}: Not found")
            all_ok = False
    
    return all_ok

def install_npm_dependencies():
    """Install npm dependencies"""
    print_header("Installing NPM Dependencies")
    print_info("Running npm install...")
    result = run_command("npm install")
    if result.returncode == 0:
        print_success("NPM dependencies installed successfully")
    return result.returncode == 0

def install_python_dependencies():
    """Install Python dependencies"""
    print_header("Installing Python Dependencies")
    if os.path.exists("requirements.txt"):
        print_info("Running pip install...")
        result = run_command("pip install -r requirements.txt")
        if result.returncode == 0:
            print_success("Python dependencies installed successfully")
        return result.returncode == 0
    else:
        print_info("No requirements.txt found, skipping")
        return True

def lint_code():
    """Run linting checks"""
    print_header("Linting Code")
    
    # TypeScript/JavaScript linting
    if os.path.exists("package.json"):
        print_info("Running ESLint...")
        result = run_command("npm run lint", check=False)
        if result.returncode == 0:
            print_success("JavaScript/TypeScript linting passed")
        else:
            print_error("JavaScript/TypeScript linting failed")
            return False
    
    return True

def type_check():
    """Run TypeScript type checking"""
    print_header("Type Checking")
    
    if os.path.exists("tsconfig.json"):
        print_info("Running TypeScript type check...")
        result = run_command("npm run type-check", check=False)
        if result.returncode == 0:
            print_success("Type checking passed")
        else:
            print_error("Type checking failed")
            return False
    
    return True

def build_frontend():
    """Build the frontend application"""
    print_header("Building Frontend")
    print_info("Running production build...")
    result = run_command("npm run build")
    if result.returncode == 0:
        print_success("Frontend built successfully")
        
        # Check build output
        dist_path = Path("dist")
        if dist_path.exists():
            files = list(dist_path.rglob("*"))
            print_success(f"Build output: {len(files)} files in dist/")
        
        return True
    return False

def test_code():
    """Run tests"""
    print_header("Running Tests")
    print_info("Tests not configured yet")
    return True

def generate_build_info():
    """Generate build information file"""
    print_header("Generating Build Info")
    
    build_info = {
        'version': '1.0.0',
        'build_date': datetime.now().isoformat(),
        'git_commit': run_command('git rev-parse HEAD', check=False).stdout.strip(),
        'git_branch': run_command('git rev-parse --abbrev-ref HEAD', check=False).stdout.strip()
    }
    
    info_path = Path('dist/build-info.json')
    if info_path.parent.exists():
        import json
        with open(info_path, 'w') as f:
            json.dump(build_info, f, indent=2)
        print_success(f"Build info generated: {info_path}")
    
    return True

def clean_build():
    """Clean build artifacts"""
    print_header("Cleaning Build Artifacts")
    
    paths_to_clean = ['dist', 'build', 'node_modules/.cache']
    
    for path in paths_to_clean:
        if os.path.exists(path):
            print_info(f"Removing {path}...")
            run_command(f"rm -rf {path}")
            print_success(f"Removed {path}")
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Ticru.io Build System')
    parser.add_argument('--clean', action='store_true', help='Clean build artifacts')
    parser.add_argument('--install', action='store_true', help='Install dependencies')
    parser.add_argument('--lint', action='store_true', help='Run linting')
    parser.add_argument('--type-check', action='store_true', help='Run type checking')
    parser.add_argument('--build', action='store_true', help='Build the application')
    parser.add_argument('--test', action='store_true', help='Run tests')
    parser.add_argument('--all', action='store_true', help='Run complete build pipeline')
    
    args = parser.parse_args()
    
    # If no specific action, run all
    if not any([args.clean, args.install, args.lint, args.type_check, args.build, args.test, args.all]):
        args.all = True
    
    start_time = datetime.now()
    print_header(f"Ticru.io Build System - {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    success = True
    
    # Check dependencies first
    if not check_dependencies():
        print_error("Missing required dependencies")
        sys.exit(1)
    
    # Execute requested actions
    if args.clean or args.all:
        success = success and clean_build()
    
    if args.install or args.all:
        success = success and install_npm_dependencies()
        success = success and install_python_dependencies()
    
    if args.lint or args.all:
        success = success and lint_code()
    
    if args.type_check or args.all:
        success = success and type_check()
    
    if args.build or args.all:
        success = success and build_frontend()
        if success:
            success = success and generate_build_info()
    
    if args.test or args.all:
        success = success and test_code()
    
    # Summary
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    print_header("Build Summary")
    print(f"Duration: {duration:.2f} seconds")
    
    if success:
        print_success("Build completed successfully!")
        sys.exit(0)
    else:
        print_error("Build failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
