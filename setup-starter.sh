#!/bin/bash

# ChatFlow Starter Template - Quick Setup Script
# This script helps you quickly customize ChatFlow for your own project

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║         🚀 ChatFlow Starter Template Setup 🚀                 ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed${NC}"
    exit 1
fi

echo -e "${BLUE}This script will help you set up ChatFlow as your own project.${NC}"
echo ""

# Get project name
read -p "Enter your project name (e.g., my-awesome-app): " PROJECT_NAME
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}Project name cannot be empty${NC}"
    exit 1
fi

# Get project description
read -p "Enter project description: " PROJECT_DESC

# Get author name
read -p "Enter your name: " AUTHOR_NAME

# Get author email
read -p "Enter your email: " AUTHOR_EMAIL

echo ""
echo -e "${YELLOW}Setting up your project: $PROJECT_NAME${NC}"
echo ""

# Update package.json
echo -e "${BLUE}1. Updating package.json...${NC}"
npm pkg set name="$PROJECT_NAME"
npm pkg set description="$PROJECT_DESC"
npm pkg set version="1.0.0"
npm pkg set author="$AUTHOR_NAME <$AUTHOR_EMAIL>"
npm pkg delete private
echo -e "${GREEN}✓ package.json updated${NC}"

# Update index.html title
echo -e "${BLUE}2. Updating index.html...${NC}"
TITLE_NAME=$(echo $PROJECT_NAME | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
sed -i.bak "s/<title>.*<\/title>/<title>$TITLE_NAME<\/title>/" index.html
rm -f index.html.bak
echo -e "${GREEN}✓ index.html updated${NC}"

# Create .env from .env.example
echo -e "${BLUE}3. Creating .env file...${NC}"
if [ -f .env ]; then
    read -p ".env already exists. Overwrite? (y/n): " OVERWRITE
    if [ "$OVERWRITE" = "y" ] || [ "$OVERWRITE" = "Y" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env created (please configure it)${NC}"
    else
        echo -e "${YELLOW}⊘ Skipped .env creation${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✓ .env created (please configure it)${NC}"
fi

# Option to reset git history
echo ""
read -p "Do you want to reset git history? (y/n): " RESET_GIT
if [ "$RESET_GIT" = "y" ] || [ "$RESET_GIT" = "Y" ]; then
    echo -e "${BLUE}4. Resetting git history...${NC}"
    rm -rf .git
    git init
    git add .
    git commit -m "Initial commit from ChatFlow template"
    echo -e "${GREEN}✓ Git history reset${NC}"
    
    read -p "Enter your remote repository URL (or press Enter to skip): " REMOTE_URL
    if [ ! -z "$REMOTE_URL" ]; then
        git remote add origin "$REMOTE_URL"
        echo -e "${GREEN}✓ Remote origin set to $REMOTE_URL${NC}"
    fi
else
    echo -e "${YELLOW}⊘ Skipped git history reset${NC}"
fi

# Install dependencies
echo ""
read -p "Install dependencies now? (y/n): " INSTALL_DEPS
if [ "$INSTALL_DEPS" = "y" ] || [ "$INSTALL_DEPS" = "Y" ]; then
    echo -e "${BLUE}5. Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⊘ Skipped dependency installation${NC}"
    echo -e "${YELLOW}   Run 'npm install' when you're ready${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║              ✨ Setup Complete! ✨                             ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Your project '$PROJECT_NAME' is ready!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Configure Firebase credentials in ${BLUE}.env${NC}"
echo -e "  2. Customize your app (see ${BLUE}STARTER-TEMPLATE-GUIDE.md${NC})"
echo -e "  3. Run ${BLUE}npm run dev${NC} to start development"
echo -e "  4. Build with ${BLUE}npm run build${NC}"
echo -e "  5. Deploy (see ${BLUE}AWS-DEPLOYMENT.md${NC})"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo -e "  • ${BLUE}STARTER-TEMPLATE-GUIDE.md${NC} - Complete customization guide"
echo -e "  • ${BLUE}README.md${NC} - Project overview"
echo -e "  • ${BLUE}AWS-DEPLOYMENT.md${NC} - Deployment guide"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
