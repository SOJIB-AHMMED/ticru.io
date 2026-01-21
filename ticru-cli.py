#!/usr/bin/env python3
"""
Ticru.io CLI Tool
Command-line interface for managing the Ticru.io application
"""

import click
import subprocess
import os
import sys
import signal
from pathlib import Path
from multiprocessing import Process

@click.group()
@click.version_option(version='1.0.0')
def cli():
    """Ticru.io Command Line Interface"""
    pass

@cli.command()
@click.option('--port', default=8000, help='Port to run the server on')
@click.option('--host', default='0.0.0.0', help='Host to bind to')
def serve(port, host):
    """Start the API server"""
    click.echo(f"🚀 Starting Ticru.io API server on {host}:{port}")
    subprocess.run([
        'uvicorn',
        'api-server:app',
        '--host', host,
        '--port', str(port),
        '--reload'
    ])

@cli.command()
@click.option('--port', default=5173, help='Port to run the dev server on')
def dev(port):
    """Start the development server"""
    click.echo(f"🔧 Starting development server on port {port}")
    subprocess.run(['npm', 'run', 'dev', '--', '--port', str(port)])

@cli.command()
@click.option('--frontend-port', default=5173, help='Port for the frontend dev server')
@click.option('--backend-port', default=8000, help='Port for the backend API server')
@click.option('--backend-host', default='0.0.0.0', help='Host for the backend server')
def run(frontend_port, backend_port, backend_host):
    """Start both frontend and backend servers concurrently"""
    click.echo("🚀 Starting Ticru.io Application")
    click.echo("="*60)
    click.echo(f"  Frontend Dev Server: http://localhost:{frontend_port}")
    click.echo(f"  Backend API Server:  http://{backend_host}:{backend_port}")
    click.echo("="*60)
    click.echo("\nPress Ctrl+C to stop both servers\n")
    
    # Start backend server
    def start_backend():
        subprocess.run([
            'uvicorn',
            'api-server:app',
            '--host', backend_host,
            '--port', str(backend_port),
            '--reload'
        ])
    
    # Start frontend server
    def start_frontend():
        subprocess.run(['npm', 'run', 'dev', '--', '--port', str(frontend_port)])
    
    # Create processes
    backend_process = Process(target=start_backend)
    frontend_process = Process(target=start_frontend)
    
    # Handle graceful shutdown
    def signal_handler(sig, frame):
        click.echo("\n\n🛑 Shutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        backend_process.join(timeout=5)
        frontend_process.join(timeout=5)
        click.echo("✅ Servers stopped")
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Start both servers
        backend_process.start()
        frontend_process.start()
        
        # Wait for processes
        backend_process.join()
        frontend_process.join()
    except KeyboardInterrupt:
        click.echo("\n\n🛑 Shutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        backend_process.join(timeout=5)
        frontend_process.join(timeout=5)
        click.echo("✅ Servers stopped")

@cli.command()
def build():
    """Build the application for production"""
    click.echo("🏗️  Building application...")
    subprocess.run(['python3', 'build-system.py', '--all'])

@cli.command()
def install():
    """Install all dependencies"""
    click.echo("📦 Installing dependencies...")
    click.echo("\n→ Installing npm dependencies...")
    subprocess.run(['npm', 'install'])
    
    if Path('requirements.txt').exists():
        click.echo("\n→ Installing Python dependencies...")
        subprocess.run(['pip', 'install', '-r', 'requirements.txt'])
    
    click.echo("\n✅ Dependencies installed successfully!")

@cli.command()
def test():
    """Run all tests"""
    click.echo("🧪 Running tests...")
    click.echo("⚠️  Tests not configured yet")

@cli.command()
def lint():
    """Run code linting"""
    click.echo("🔍 Running linters...")
    subprocess.run(['npm', 'run', 'lint'])

@cli.command()
@click.option('--sql-file', default='BUILD-DATABASE.sql', help='SQL file to execute')
def init_db(sql_file):
    """Initialize the database"""
    click.echo(f"🗄️  Initializing database from {sql_file}")
    
    if not Path(sql_file).exists():
        click.echo(f"❌ Error: {sql_file} not found", err=True)
        sys.exit(1)
    
    db_url = os.getenv('DATABASE_URL', 'postgresql://localhost/ticru_db')
    click.echo(f"Database URL: {db_url}")
    
    try:
        subprocess.run([
            'psql',
            db_url,
            '-f',
            sql_file
        ], check=True)
        click.echo("✅ Database initialized successfully!")
    except subprocess.CalledProcessError:
        click.echo("❌ Failed to initialize database", err=True)
        click.echo("Make sure PostgreSQL is running and DATABASE_URL is set correctly")
        sys.exit(1)

@cli.command()
def clean():
    """Clean build artifacts"""
    click.echo("🧹 Cleaning build artifacts...")
    
    paths = ['dist', 'build', 'node_modules/.cache', '__pycache__', '*.pyc']
    
    for path in paths:
        if '*' in path:
            subprocess.run(['find', '.', '-name', path, '-delete'], check=False)
        elif Path(path).exists():
            subprocess.run(['rm', '-rf', path])
            click.echo(f"  Removed {path}")
    
    click.echo("✅ Cleanup complete!")

@cli.command()
@click.option('--platform', type=click.Choice(['vercel', 'netlify']), required=True)
def deploy(platform):
    """Deploy to production"""
    click.echo(f"🚀 Deploying to {platform}...")
    
    if platform == 'vercel':
        if not Path('deploy-vercel.sh').exists():
            click.echo("❌ deploy-vercel.sh not found", err=True)
            sys.exit(1)
        subprocess.run(['bash', 'deploy-vercel.sh'])
    elif platform == 'netlify':
        subprocess.run(['netlify', 'deploy', '--prod'])
    
    click.echo("✅ Deployment complete!")

@cli.command()
def setup():
    """Run the complete setup wizard"""
    click.echo("🎯 Ticru.io Setup Wizard")
    click.echo("="*50)
    
    # Check Node.js
    click.echo("\n1. Checking Node.js...")
    result = subprocess.run(['node', '--version'], capture_output=True, text=True)
    if result.returncode == 0:
        click.echo(f"   ✅ Node.js {result.stdout.strip()}")
    else:
        click.echo("   ❌ Node.js not found")
        sys.exit(1)
    
    # Check Python
    click.echo("\n2. Checking Python...")
    result = subprocess.run(['python3', '--version'], capture_output=True, text=True)
    if result.returncode == 0:
        click.echo(f"   ✅ Python {result.stdout.strip()}")
    else:
        click.echo("   ❌ Python not found")
        sys.exit(1)
    
    # Install dependencies
    click.echo("\n3. Installing dependencies...")
    subprocess.run(['npm', 'install'])
    if Path('requirements.txt').exists():
        subprocess.run(['pip', 'install', '-r', 'requirements.txt'])
    click.echo("   ✅ Dependencies installed")
    
    # Create .env if not exists
    click.echo("\n4. Setting up environment...")
    if not Path('.env').exists() and Path('.env.example').exists():
        subprocess.run(['cp', '.env.example', '.env'])
        click.echo("   ✅ Created .env file")
    else:
        click.echo("   ✅ Environment already configured")
    
    click.echo("\n" + "="*50)
    click.echo("✅ Setup complete!")
    click.echo("\nNext steps:")
    click.echo("  • Run 'python3 ticru-cli.py dev' to start development server")
    click.echo("  • Run 'python3 ticru-cli.py serve' to start API server")
    click.echo("  • Run 'python3 ticru-cli.py build' to build for production")

@cli.command()
def status():
    """Show application status"""
    click.echo("📊 Ticru.io Status")
    click.echo("="*50)
    
    # Check if servers are running
    click.echo("\nServer Status:")
    
    # Check API server
    try:
        import requests
        response = requests.get('http://localhost:8000/api/health', timeout=2)
        if response.status_code == 200:
            click.echo("  API Server: ✅ Running (port 8000)")
        else:
            click.echo("  API Server: ⚠️  Unhealthy")
    except:
        click.echo("  API Server: ❌ Not running")
    
    # Check dev server
    try:
        import requests
        response = requests.get('http://localhost:5173', timeout=2)
        if response.status_code == 200:
            click.echo("  Dev Server: ✅ Running (port 5173)")
        else:
            click.echo("  Dev Server: ⚠️  Unhealthy")
    except:
        click.echo("  Dev Server: ❌ Not running")
    
    # Build status
    click.echo("\nBuild Status:")
    if Path('dist').exists():
        files = list(Path('dist').rglob('*'))
        click.echo(f"  Build Output: ✅ {len(files)} files")
    else:
        click.echo("  Build Output: ❌ Not built")
    
    # Dependencies
    click.echo("\nDependencies:")
    if Path('node_modules').exists():
        click.echo("  NPM Packages: ✅ Installed")
    else:
        click.echo("  NPM Packages: ❌ Not installed")

if __name__ == '__main__':
    cli()
