#!/bin/bash

# AWS S3 + CloudFront Deployment Script for ChatFlow
# 
# Prerequisites:
# 1. AWS CLI installed and configured (aws configure)
# 2. S3 bucket created
# 3. CloudFront distribution created
# 4. Update the variables below with your values

# Configuration - REPLACE WITH YOUR VALUES
BUCKET_NAME="chatflow-app-your-unique-name"
DISTRIBUTION_ID="your-cloudfront-distribution-id"
REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "   ChatFlow AWS Deployment Script"
echo "=========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Please install it from: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit 1
fi

# Check if bucket name is configured
if [ "$BUCKET_NAME" = "chatflow-app-your-unique-name" ]; then
    echo -e "${RED}Error: Please configure BUCKET_NAME in this script${NC}"
    echo "Edit deploy-s3.sh and set your S3 bucket name"
    exit 1
fi

# Check if distribution ID is configured
if [ "$DISTRIBUTION_ID" = "your-cloudfront-distribution-id" ]; then
    echo -e "${YELLOW}Warning: DISTRIBUTION_ID not configured${NC}"
    echo "CloudFront cache invalidation will be skipped"
    SKIP_INVALIDATION=true
fi

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"
echo ""

# Upload static assets with long cache
echo -e "${YELLOW}Uploading static assets to S3...${NC}"
aws s3 sync dist/ s3://$BUCKET_NAME \
  --region $REGION \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.html" \
  --exclude "*.json"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to upload static assets${NC}"
    exit 1
fi

# Upload HTML files with no-cache
echo -e "${YELLOW}Uploading HTML files to S3...${NC}"
aws s3 sync dist/ s3://$BUCKET_NAME \
  --region $REGION \
  --delete \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to upload HTML files${NC}"
    exit 1
fi

# Upload JSON files with short cache
echo -e "${YELLOW}Uploading manifest files to S3...${NC}"
aws s3 sync dist/ s3://$BUCKET_NAME \
  --region $REGION \
  --delete \
  --cache-control "public, max-age=3600" \
  --exclude "*" \
  --include "*.json"

echo -e "${GREEN}All files uploaded successfully!${NC}"
echo ""

# Invalidate CloudFront cache
if [ "$SKIP_INVALIDATION" != true ]; then
    echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id $DISTRIBUTION_ID \
      --paths "/*" \
      --query 'Invalidation.Id' \
      --output text)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Cache invalidation created: $INVALIDATION_ID${NC}"
        echo "Note: Invalidation may take 5-10 minutes to complete"
    else
        echo -e "${RED}Failed to create cache invalidation${NC}"
        echo "You may need to manually invalidate the cache in AWS Console"
    fi
else
    echo -e "${YELLOW}Skipping CloudFront cache invalidation${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}   Deployment completed successfully!${NC}"
echo "=========================================="
echo ""
echo "Your app is now live at:"
echo "S3 Website: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
if [ "$SKIP_INVALIDATION" != true ]; then
    echo "CloudFront: Check your CloudFront distribution URL"
fi
echo ""
