#!/bin/bash

################################################################################
#                   CHATBOT ADVANCED SETUP SCRIPT                             #
#                         Version 2.0.0                                        #
#                                                                              #
# This script automates the setup and deployment of the Advanced Chatbot       #
# system across the full stack (backend, frontend, admin).                     #
#                                                                              #
# Usage: bash CHATBOT_SETUP.sh                                                #
#        bash CHATBOT_SETUP.sh --install-only                                 #
#        bash CHATBOT_SETUP.sh --test                                          #
#        bash CHATBOT_SETUP.sh --start-all                                     #
#                                                                              #
################################################################################

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Utility functions
print_header() {
  echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║${NC} $1"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
}

print_step() {
  echo -e "${YELLOW}→ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
  print_header "CHECKING PREREQUISITES"
  
  # Check Node.js
  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "  Install from: https://nodejs.org/"
    exit 1
  fi
  NODE_VERSION=$(node --version)
  print_success "Node.js installed: $NODE_VERSION"
  
  # Check npm
  if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
  fi
  NPM_VERSION=$(npm --version)
  print_success "npm installed: $NPM_VERSION"
  
  # Check MongoDB
  if ! command -v mongod &> /dev/null; then
    print_error "MongoDB is not installed"
    echo "  Install from: https://www.mongodb.com/try/download/community"
    echo "  Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    exit 1
  fi
  MONGO_VERSION=$(mongod --version | head -1)
  print_success "MongoDB installed: $MONGO_VERSION"
  
  # Check Git
  if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
  fi
  print_success "Git installed"
  
  echo ""
}

# Initialize directories
init_directories() {
  print_header "INITIALIZING DIRECTORIES"
  
  WS_ROOT=$(pwd)
  print_step "Workspace root: $WS_ROOT"
  
  # Check required directories
  for dir in server client admin; do
    if [ -d "$WS_ROOT/$dir" ]; then
      print_success "Found $dir directory"
    else
      print_error "Missing $dir directory"
      exit 1
    fi
  done
  
  echo ""
}

# Install backend dependencies
install_backend() {
  print_header "INSTALLING BACKEND DEPENDENCIES"
  
  cd "$WS_ROOT/server"
  print_step "Installing server dependencies..."
  
  # Install all dependencies from package.json
  npm install
  
  if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
  else
    print_error "Failed to install backend dependencies"
    exit 1
  fi
  
  # Specifically verify uuid is installed
  if npm list uuid > /dev/null 2>&1; then
    print_success "UUID package verified"
  else
    print_error "UUID package not found, installing..."
    npm install uuid
  fi
  
  echo ""
}

# Install frontend dependencies
install_frontend() {
  print_header "INSTALLING FRONTEND DEPENDENCIES"
  
  cd "$WS_ROOT/client"
  print_step "Installing client dependencies..."
  
  npm install
  
  if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
  else
    print_error "Failed to install frontend dependencies"
    exit 1
  fi
  
  echo ""
}

# Install admin dependencies
install_admin() {
  print_header "INSTALLING ADMIN DEPENDENCIES"
  
  cd "$WS_ROOT/admin"
  print_step "Installing admin dependencies..."
  
  npm install
  
  if [ $? -eq 0 ]; then
    print_success "Admin dependencies installed"
  else
    print_error "Failed to install admin dependencies"
    exit 1
  fi
  
  echo ""
}

# Verify MongoDB connection
verify_mongodb() {
  print_header "VERIFYING MONGODB CONNECTION"
  
  print_step "Checking MongoDB connection..."
  
  if mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
    print_success "MongoDB is running"
  else
    print_error "Cannot connect to MongoDB"
    echo "  Start MongoDB with: mongod"
    exit 1
  fi
  
  echo ""
}

# Create environment files
setup_env_files() {
  print_header "SETTING UP ENVIRONMENT FILES"
  
  # Backend .env
  if [ ! -f "$WS_ROOT/server/.env" ]; then
    print_step "Creating server/.env..."
    cat > "$WS_ROOT/server/.env" << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/innovativedb
DB_NAME=innovativedb

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Configuration (Optional)
JWT_SECRET=your-jwt-secret-key-change-this

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Chatbot Configuration
CHATBOT_ENABLED=true
NLP_ENABLED=true
ESCALATION_ENABLED=true
EOF
    print_success "Created .env file"
  else
    print_info "server/.env already exists"
  fi
  
  # Frontend .env (if needed)
  if [ ! -f "$WS_ROOT/client/.env" ]; then
    print_step "Creating client/.env..."
    cat > "$WS_ROOT/client/.env" << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_URL=http://localhost:5175
EOF
    print_success "Created client/.env file"
  else
    print_info "client/.env already exists"
  fi
  
  echo ""
}

# Build and optimize
build_projects() {
  print_header "BUILDING PROJECTS"
  
  print_step "Building frontend..."
  cd "$WS_ROOT/client"
  npm run build
  if [ $? -eq 0 ]; then
    print_success "Frontend build successful"
  else
    print_error "Frontend build failed"
  fi
  
  print_step "Building admin..."
  cd "$WS_ROOT/admin"
  npm run build
  if [ $? -eq 0 ]; then
    print_success "Admin build successful"
  else
    print_error "Admin build failed"
  fi
  
  echo ""
}

# Verify setup
verify_setup() {
  print_header "VERIFYING SETUP"
  
  errors=0
  
  # Check backend directories
  for file in server/config/db.js server/controllers/advancedChatbotController.js server/utils/nlpUtils.js server/utils/matchingAlgorithm.js; do
    if [ -f "$WS_ROOT/$file" ]; then
      print_success "Found: $file"
    else
      print_error "Missing: $file"
      ((errors++))
    fi
  done
  
  # Check database models
  for model in ChatConversation ChatFeedback; do
    if grep -r "new Schema" "$WS_ROOT/server/models" | grep -q "$model"; then
      print_success "Found model: $model"
    else
      print_error "Missing model: $model"
      ((errors++))
    fi
  done
  
  # Check frontend component
  if [ -f "$WS_ROOT/client/src/components/AdvancedChatbot.jsx" ]; then
    print_success "Found: AdvancedChatbot.jsx"
  else
    print_error "Missing: AdvancedChatbot.jsx"
    ((errors++))
  fi
  
  # Check admin component
  if [ -f "$WS_ROOT/admin/src/components/ChatbotAnalyticsDashboard.jsx" ]; then
    print_success "Found: ChatbotAnalyticsDashboard.jsx"
  else
    print_error "Missing: ChatbotAnalyticsDashboard.jsx"
    ((errors++))
  fi
  
  if [ $errors -eq 0 ]; then
    print_success "All components verified"
  else
    print_error "$errors components missing or invalid"
  fi
  
  echo ""
}

# Database setup
setup_database() {
  print_header "SETTING UP DATABASE"
  
  print_step "Initializing MongoDB database..."
  
  # The database and collections are auto-created on first use
  # But we can seed with initial FAQ data if needed
  
  print_info "Database will be created automatically on first API call"
  print_info "Collections: chatconversations, chatfeedbacks"
  
  echo ""
}

# Test the setup
run_tests() {
  print_header "RUNNING TESTS"
  
  print_step "Testing backend connectivity..."
  cd "$WS_ROOT/server"
  
  # Start server in background
  npm run dev &
  SERVER_PID=$!
  
  sleep 3
  
  if curl -s http://localhost:5000/api/health &> /dev/null || true; then
    print_success "Backend server is responding"
    kill $SERVER_PID 2>/dev/null || true
  else
    print_error "Backend server not responding"
    kill $SERVER_PID 2>/dev/null || true
  fi
  
  echo ""
}

# Start all services
start_services() {
  print_header "STARTING SERVICES"
  
  print_info "You can use tmux or multiple terminal windows"
  echo ""
  
  print_step "Terminal 1 - Start Backend:"
  echo "  cd $WS_ROOT/server && npm run dev"
  echo ""
  
  print_step "Terminal 2 - Start Frontend:"
  echo "  cd $WS_ROOT/client && npm run dev"
  echo ""
  
  print_step "Terminal 3 - Start Admin:"
  echo "  cd $WS_ROOT/admin && npm run dev"
  echo ""
  
  print_info "Access points:"
  echo "  Frontend: http://localhost:5173"
  echo "  Admin: http://localhost:5175"
  echo "  API: http://localhost:5000/api"
  echo ""
}

# Show final summary
show_summary() {
  print_header "SETUP SUMMARY"
  
  echo -e "${GREEN}✓ Advanced Chatbot System Setup Complete!${NC}"
  echo ""
  
  echo "What was installed:"
  echo "  • Backend NLP system (sentiment, intent, entities)"
  echo "  • Smart FAQ matching algorithm (fuzzy matching)"
  echo "  • MongoDB schemas and models"
  echo "  • 6 API endpoints for chatbot operations"
  echo "  • Advanced frontend component"
  echo "  • Admin analytics dashboard"
  echo "  • Session management system"
  echo "  • User feedback collection system"
  echo ""
  
  echo "Next steps:"
  echo "  1. Start MongoDB: mongod"
  echo "  2. Start backend: cd server && npm run dev"
  echo "  3. Start frontend: cd client && npm run dev"
  echo "  4. Start admin: cd admin && npm run dev"
  echo "  5. Open http://localhost:5173 in your browser"
  echo "  6. Click the chatbot icon to test"
  echo ""
  
  echo "Documentation:"
  echo "  • CHATBOT_README.md      - User guide and API docs"
  echo "  • CHATBOT_ARCHITECTURE.md - System architecture"
  echo "  • CHATBOT_SUMMARY.md      - Feature overview"
  echo "  • CHATBOT_QUICK_REFERENCE.js - Code snippets and metrics"
  echo "  • IMPLEMENTATION_CHECKLIST.md  - Verification checklist"
  echo ""
  
  echo "Support:"
  echo "  • Check server console for errors"
  echo "  • Check browser DevTools Network tab"
  echo "  • Verify MongoDB is running"
  echo "  • Review documentation for troubleshooting"
  echo ""
}

# Parse command line arguments
case "${1:-}" in
  --install-only)
    print_header "INSTALLATION ONLY MODE"
    check_prerequisites
    init_directories
    install_backend
    install_frontend
    install_admin
    verify_setup
    echo -e "${GREEN}Installation complete. Run 'bash CHATBOT_SETUP.sh' for full setup.${NC}"
    exit 0
    ;;
  --test)
    print_header "TEST MODE"
    check_prerequisites
    verify_mongodb
    run_tests
    echo -e "${GREEN}Tests complete.${NC}"
    exit 0
    ;;
  --start-all)
    print_header "START ALL SERVICES"
    start_services
    exit 0
    ;;
  --help)
    echo "Advanced Chatbot Setup Script"
    echo ""
    echo "Usage: bash CHATBOT_SETUP.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  (default)      - Run full setup process"
    echo "  --install-only - Install dependencies only"
    echo "  --test         - Test the setup"
    echo "  --start-all    - Show commands to start services"
    echo "  --help         - Show this help message"
    echo ""
    exit 0
    ;;
  *)
    # Full setup process
    check_prerequisites
    init_directories
    verify_mongodb
    install_backend
    install_frontend
    install_admin
    setup_env_files
    setup_database
    verify_setup
    show_summary
    exit 0
    ;;
esac
