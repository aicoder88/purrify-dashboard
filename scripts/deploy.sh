#!/bin/bash

# Purrify Dashboard Deployment Script
# This script handles the complete deployment process for production

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="purrify-dashboard"
BUILD_DIR="dist"
BACKUP_DIR="backups"
LOG_FILE="deploy.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a $LOG_FILE
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18 or higher."
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="18.0.0"
    if ! npx semver -r ">=$REQUIRED_VERSION" "$NODE_VERSION" &> /dev/null; then
        error "Node.js version $NODE_VERSION is not supported. Please upgrade to version $REQUIRED_VERSION or higher."
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        error "npm is not installed."
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        error "git is not installed."
    fi
    
    success "Prerequisites check passed"
}

# Environment setup
setup_environment() {
    log "Setting up environment..."
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        warning ".env.local not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            warning "Please update .env.local with your production values before continuing."
            read -p "Press Enter to continue after updating .env.local..."
        else
            error ".env.example not found. Cannot create environment configuration."
        fi
    fi
    
    success "Environment setup completed"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm ci --production=false
    
    success "Dependencies installed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Type checking
    log "Running TypeScript type checking..."
    npm run type-check
    
    # Linting
    log "Running ESLint..."
    npm run lint
    
    # Unit tests (if available)
    if npm run | grep -q "test"; then
        log "Running unit tests..."
        npm run test
    fi
    
    success "All tests passed"
}

# Security audit
security_audit() {
    log "Running security audit..."
    
    # npm audit
    npm audit --audit-level=moderate
    
    success "Security audit completed"
}

# Build application
build_application() {
    log "Building application..."
    
    # Clean previous build
    rm -rf .next out $BUILD_DIR
    
    # Build for production
    NODE_ENV=production npm run build
    
    # Bundle analysis (optional)
    if [ "$ANALYZE_BUNDLE" = "true" ]; then
        log "Analyzing bundle size..."
        ANALYZE=true npm run build
    fi
    
    success "Application built successfully"
}

# Performance optimization
optimize_performance() {
    log "Optimizing performance..."
    
    # Compress static assets
    if command -v gzip &> /dev/null; then
        find .next/static -name "*.js" -o -name "*.css" | while read file; do
            gzip -k "$file"
        done
        success "Static assets compressed"
    fi
    
    # Generate sitemap (if applicable)
    if [ -f "scripts/generate-sitemap.js" ]; then
        node scripts/generate-sitemap.js
        success "Sitemap generated"
    fi
    
    success "Performance optimization completed"
}

# Create backup
create_backup() {
    if [ "$SKIP_BACKUP" != "true" ]; then
        log "Creating backup..."
        
        mkdir -p $BACKUP_DIR
        BACKUP_NAME="backup-$(date +'%Y%m%d-%H%M%S').tar.gz"
        
        # Backup current deployment (if exists)
        if [ -d "current" ]; then
            tar -czf "$BACKUP_DIR/$BACKUP_NAME" current/
            success "Backup created: $BACKUP_NAME"
        fi
    fi
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Create deployment directory
    mkdir -p current
    
    # Copy built application
    cp -r .next current/
    cp -r public current/
    cp package.json current/
    cp package-lock.json current/
    
    # Copy environment file
    cp .env.local current/.env.local
    
    # Install production dependencies
    cd current
    npm ci --production
    cd ..
    
    success "Application deployed"
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Start the application in background for testing
    cd current
    npm start &
    APP_PID=$!
    cd ..
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        success "Health check passed"
    else
        warning "Health check failed - application may need manual verification"
    fi
    
    # Stop the test instance
    kill $APP_PID 2>/dev/null || true
}

# Cleanup
cleanup() {
    log "Cleaning up..."
    
    # Remove old backups (keep last 5)
    if [ -d "$BACKUP_DIR" ]; then
        ls -t $BACKUP_DIR/backup-*.tar.gz | tail -n +6 | xargs -r rm
    fi
    
    # Clean build artifacts
    rm -rf node_modules/.cache
    
    success "Cleanup completed"
}

# Post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."
    
    # Generate deployment report
    cat > deployment-report.txt << EOF
Deployment Report
================
Date: $(date)
Version: $(git rev-parse HEAD)
Branch: $(git branch --show-current)
Environment: production
Build Size: $(du -sh .next | cut -f1)
Node Version: $(node -v)
NPM Version: $(npm -v)
EOF
    
    # Send notification (if configured)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚀 Purrify Dashboard deployed successfully!"}' \
            "$SLACK_WEBHOOK_URL"
    fi
    
    success "Post-deployment tasks completed"
}

# Main deployment process
main() {
    log "Starting deployment of $PROJECT_NAME..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS="true"
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP="true"
                shift
                ;;
            --analyze-bundle)
                ANALYZE_BUNDLE="true"
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --skip-tests      Skip running tests"
                echo "  --skip-backup     Skip creating backup"
                echo "  --analyze-bundle  Analyze bundle size"
                echo "  --help           Show this help message"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
    
    # Run deployment steps
    check_prerequisites
    setup_environment
    install_dependencies
    
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
        security_audit
    fi
    
    build_application
    optimize_performance
    create_backup
    deploy_application
    health_check
    cleanup
    post_deployment
    
    success "Deployment completed successfully!"
    log "Application is ready at: http://localhost:3000"
    log "Deployment report saved to: deployment-report.txt"
}

# Run main function
main "$@"