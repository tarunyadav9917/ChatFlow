# 🚀 AWS Hosting Guide for ChatFlow

This comprehensive guide will walk you through deploying ChatFlow on AWS using various deployment options.

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Deployment Options](#-deployment-options)
- [Option 1: AWS Amplify (Recommended)](#option-1-aws-amplify-recommended)
- [Option 2: S3 + CloudFront](#option-2-s3--cloudfront)
- [Option 3: Elastic Beanstalk](#option-3-elastic-beanstalk)
- [Environment Variables](#-environment-variables)
- [Custom Domain Setup](#-custom-domain-setup)
- [CI/CD with GitHub Actions](#-cicd-with-github-actions)
- [Monitoring & Logging](#-monitoring--logging)
- [Cost Optimization](#-cost-optimization)
- [Troubleshooting](#-troubleshooting)

---

## 📋 Prerequisites

Before deploying to AWS, ensure you have:

- ✅ **AWS Account** - [Sign up here](https://aws.amazon.com/)
- ✅ **AWS CLI** - [Installation guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- ✅ **Node.js** (v14 or higher)
- ✅ **Git** installed
- ✅ Project built and tested locally

### Configure AWS CLI

```bash
# Configure your AWS credentials
aws configure

# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (json)
```

---

## 🎯 Deployment Options

ChatFlow can be deployed on AWS using three main approaches:

| Option | Best For | Difficulty | Cost | Auto-Scaling |
|--------|----------|------------|------|--------------|
| **AWS Amplify** | Quick deployment, CI/CD | ⭐ Easy | $$ | ✅ Yes |
| **S3 + CloudFront** | Static hosting, full control | ⭐⭐ Medium | $ | ❌ No |
| **Elastic Beanstalk** | Full-featured apps | ⭐⭐⭐ Advanced | $$$ | ✅ Yes |

---

## Option 1: AWS Amplify (Recommended)

AWS Amplify is the easiest way to deploy React applications with built-in CI/CD.

### Step 1: Install Amplify CLI

```bash
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure
```

### Step 2: Initialize Amplify in Your Project

```bash
cd /path/to/ChatFlow
amplify init
```

Answer the prompts:
- **Project name:** ChatFlow
- **Environment name:** production
- **Default editor:** Your preferred editor
- **App type:** javascript
- **Framework:** react
- **Source directory:** src
- **Distribution directory:** dist
- **Build command:** npm run build
- **Start command:** npm run dev

### Step 3: Add Hosting

```bash
amplify add hosting
```

Choose:
- **Select hosting type:** Hosting with Amplify Console
- **Continuous deployment:** Yes (for automatic deployments from Git)

### Step 4: Deploy

```bash
# Build and deploy
amplify publish
```

Your app will be deployed and you'll receive a URL like:
```
https://main.xxxxxxx.amplifyapp.com
```

### Step 5: Connect to GitHub (Optional)

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click on your app
3. Click "Connect branch"
4. Authorize GitHub
5. Select repository: `tarunyadav9917/ChatFlow`
6. Select branch: `main`
7. Amplify will automatically build and deploy on every push

### Amplify Build Settings

Create `amplify.yml` in your project root:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## Option 2: S3 + CloudFront

This option gives you full control and is cost-effective for static sites.

### Step 1: Build Your Application

```bash
cd /path/to/ChatFlow
npm install
npm run build
```

This creates a `dist` folder with your production build.

### Step 2: Create an S3 Bucket

```bash
# Create bucket (replace with unique name)
aws s3 mb s3://chatflow-app-your-unique-name --region us-east-1

# Enable static website hosting
aws s3 website s3://chatflow-app-your-unique-name \
  --index-document index.html \
  --error-document index.html
```

### Step 3: Configure Bucket Policy

Create a file `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::chatflow-app-your-unique-name/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket chatflow-app-your-unique-name \
  --policy file://bucket-policy.json
```

### Step 4: Upload Files to S3

```bash
# Upload dist folder
aws s3 sync dist/ s3://chatflow-app-your-unique-name \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.html"

# Upload HTML files separately with no-cache
aws s3 sync dist/ s3://chatflow-app-your-unique-name \
  --delete \
  --cache-control "no-cache" \
  --exclude "*" \
  --include "*.html"
```

### Step 5: Create CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name chatflow-app-your-unique-name.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

Or use the AWS Console:

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create Distribution"
3. **Origin Settings:**
   - Origin Domain: Your S3 bucket website endpoint
   - Origin Protocol Policy: HTTP only
4. **Default Cache Behavior:**
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS
   - Compress Objects Automatically: Yes
5. **Distribution Settings:**
   - Price Class: Use only North America and Europe (or your preferred regions)
   - Alternate Domain Names (CNAMEs): your-domain.com (optional)
   - SSL Certificate: Default CloudFront Certificate (or custom)
   - Default Root Object: index.html

### Step 6: Configure Error Pages for SPA Routing

In CloudFront Console:
1. Go to "Error Pages" tab
2. Create custom error response:
   - HTTP Error Code: 403
   - Customize Error Response: Yes
   - Response Page Path: /index.html
   - HTTP Response Code: 200
3. Repeat for error code 404

### Step 7: Deployment Script

Create `deploy-s3.sh`:

```bash
#!/bin/bash

BUCKET_NAME="chatflow-app-your-unique-name"
DISTRIBUTION_ID="your-cloudfront-distribution-id"

# Build
echo "Building application..."
npm run build

# Upload to S3
echo "Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.html"

aws s3 sync dist/ s3://$BUCKET_NAME \
  --delete \
  --cache-control "no-cache" \
  --exclude "*" \
  --include "*.html"

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

Make it executable and run:

```bash
chmod +x deploy-s3.sh
./deploy-s3.sh
```

---

## Option 3: Elastic Beanstalk

For applications that might need server-side rendering or API integration in the future.

### Step 1: Install Elastic Beanstalk CLI

```bash
pip install awsebcli
```

### Step 2: Initialize EB Application

```bash
cd /path/to/ChatFlow
eb init
```

Answer the prompts:
- **Region:** us-east-1 (or your preferred region)
- **Application name:** ChatFlow
- **Platform:** Node.js
- **Platform version:** Node.js 18 (or latest)
- **SSH:** Yes (recommended)

### Step 3: Create Environment

```bash
eb create chatflow-production
```

### Step 4: Configure for Static Site

Create `.ebextensions/staticsite.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npx serve -s dist -l 8080"
  aws:elasticbeanstalk:application:environment:
    PORT: "8080"
```

Update `package.json` to add serve:

```json
{
  "dependencies": {
    "serve": "^14.2.0"
  },
  "scripts": {
    "start": "serve -s dist -l 8080"
  }
}
```

### Step 5: Deploy

```bash
# Deploy
eb deploy

# Open in browser
eb open
```

### Step 6: Configure Environment Variables

```bash
# Set environment variables
eb setenv VITE_FIREBASE_API_KEY=your_key \
  VITE_FIREBASE_AUTH_DOMAIN=your_domain \
  VITE_FIREBASE_PROJECT_ID=your_project
```

---

## 🔐 Environment Variables

### For Amplify

1. Go to Amplify Console
2. Select your app
3. Go to "Environment variables"
4. Add each variable:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### For S3 + CloudFront

Environment variables must be built into the app. Create `.env.production`:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Build with production env:

```bash
npm run build
```

**Important:** Add `.env.production` to `.gitignore` to avoid committing secrets!

### Using AWS Systems Manager Parameter Store

For better security, use AWS Parameter Store:

```bash
# Store secrets
aws ssm put-parameter \
  --name "/chatflow/firebase-api-key" \
  --value "your_api_key" \
  --type "SecureString"

# Retrieve during build
FIREBASE_KEY=$(aws ssm get-parameter \
  --name "/chatflow/firebase-api-key" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text)
```

---

## 🌐 Custom Domain Setup

### For Amplify

1. Go to Amplify Console
2. Select your app
3. Click "Domain management"
4. Click "Add domain"
5. Enter your domain (e.g., chatflow.com)
6. Follow the DNS configuration instructions
7. Wait for SSL certificate provisioning (automatic)

### For CloudFront + S3

1. **Request SSL Certificate (ACM):**

```bash
aws acm request-certificate \
  --domain-name chatflow.com \
  --domain-name www.chatflow.com \
  --validation-method DNS \
  --region us-east-1
```

2. **Validate Domain:** Check email or add DNS records

3. **Update CloudFront Distribution:**
   - Add Alternate Domain Names (CNAMEs): chatflow.com, www.chatflow.com
   - Select Custom SSL Certificate: Your ACM certificate

4. **Update DNS (Route 53 or your provider):**

Create A record with Alias:
- Name: chatflow.com
- Type: A - IPv4 address
- Alias: Yes
- Alias Target: Your CloudFront distribution

Create CNAME record:
- Name: www.chatflow.com
- Type: CNAME
- Value: Your CloudFront distribution domain

---

## 🔄 CI/CD with GitHub Actions

### For S3 + CloudFront Deployment

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1

    - name: Deploy to S3
      run: |
        aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} \
          --delete \
          --cache-control "public, max-age=31536000" \
          --exclude "index.html" \
          --exclude "*.html"
        
        aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} \
          --delete \
          --cache-control "no-cache" \
          --exclude "*" \
          --include "*.html"

    - name: Invalidate CloudFront cache
      run: |
        aws cloudfront create-invalidation \
          --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
          --paths "/*"

    - name: Deployment status
      run: echo "Deployment completed successfully!"
```

### Required GitHub Secrets

Add these secrets in GitHub repository settings (Settings > Secrets and variables > Actions):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### For Amplify

Amplify has built-in CI/CD. Just connect your GitHub repository and it will automatically deploy on push.

---

## 📊 Monitoring & Logging

### CloudWatch Logs

Enable CloudFront logging:

```bash
# Create S3 bucket for logs
aws s3 mb s3://chatflow-logs-bucket

# Enable CloudFront logging
aws cloudfront update-distribution \
  --id YOUR_DISTRIBUTION_ID \
  --logging-config \
    Enabled=true,Bucket=chatflow-logs-bucket.s3.amazonaws.com,Prefix=cloudfront/
```

### Monitoring with CloudWatch

1. Go to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Create Dashboard
3. Add metrics:
   - CloudFront Requests
   - Error Rate (4xx, 5xx)
   - Data Transfer
   - Cache Hit Rate

### Set Up Alarms

```bash
# Create alarm for high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name chatflow-high-error-rate \
  --alarm-description "Triggers when error rate exceeds 5%" \
  --metric-name 4xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 5.0 \
  --comparison-operator GreaterThanThreshold
```

### AWS X-Ray (Optional)

For detailed tracing:

1. Enable X-Ray in Amplify or add to CloudFront
2. View traces in X-Ray console
3. Analyze performance bottlenecks

---

## 💰 Cost Optimization

### Tips to Reduce AWS Costs

1. **Use CloudFront Caching:**
   - Set appropriate Cache-Control headers
   - Cache static assets for 1 year
   - Cache HTML for shorter periods

2. **Compress Files:**
   - Enable CloudFront compression
   - Gzip/Brotli compression for all text files

3. **Optimize Images:**
   - Use WebP format
   - Lazy load images
   - Resize images appropriately

4. **S3 Intelligent-Tiering:**
   ```bash
   aws s3api put-bucket-intelligent-tiering-configuration \
     --bucket chatflow-app-your-unique-name \
     --id "ChatFlowTiering" \
     --intelligent-tiering-configuration file://tiering.json
   ```

5. **Clean Up Old Versions:**
   - Enable S3 lifecycle policies
   - Delete old CloudFront invalidations

### Estimated Monthly Costs

| Service | Usage | Estimated Cost |
|---------|-------|----------------|
| S3 Storage | 1 GB | $0.023 |
| CloudFront | 50 GB transfer | $4.25 |
| Route 53 | 1 hosted zone | $0.50 |
| **Total** | | **~$5/month** |

*Note: Amplify costs around $15-20/month for small apps with CI/CD*

---

## 🔧 Troubleshooting

### Common Issues

#### 1. 404 Errors on Page Refresh

**Problem:** SPA routing doesn't work after refresh

**Solution:** Configure error pages in CloudFront to redirect to index.html

```bash
# CloudFront error pages configuration
403 -> /index.html (200)
404 -> /index.html (200)
```

#### 2. CORS Issues

**Problem:** API calls fail with CORS errors

**Solution:** Add CORS configuration to S3 bucket:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

Apply:
```bash
aws s3api put-bucket-cors \
  --bucket chatflow-app-your-unique-name \
  --cors-configuration file://cors.json
```

#### 3. Environment Variables Not Working

**Problem:** VITE_* variables undefined in production

**Solution:** Ensure variables are prefixed with `VITE_` and set during build:

```bash
VITE_FIREBASE_API_KEY=xxx npm run build
```

#### 4. SSL Certificate Issues

**Problem:** HTTPS not working

**Solution:** 
- Ensure ACM certificate is in `us-east-1` region
- Wait for certificate validation to complete
- Clear browser cache

#### 5. CloudFront Cache Not Updating

**Problem:** Changes not visible after deployment

**Solution:** Create cache invalidation:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Debugging Commands

```bash
# Check S3 bucket contents
aws s3 ls s3://chatflow-app-your-unique-name --recursive

# Test CloudFront distribution
curl -I https://your-distribution.cloudfront.net

# Check CloudFront cache statistics
aws cloudfront get-distribution-config \
  --id YOUR_DISTRIBUTION_ID

# View CloudWatch logs
aws logs tail /aws/cloudfront/ChatFlow --follow
```

---

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Elastic Beanstalk Guide](https://docs.aws.amazon.com/elasticbeanstalk/)
- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)

---

## 🤝 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review AWS CloudWatch logs
3. Open an issue on [GitHub](https://github.com/tarunyadav9917/ChatFlow/issues)

---

## 📝 Deployment Checklist

Before deploying to production:

- [ ] Test build locally (`npm run build && npm run preview`)
- [ ] Set all environment variables
- [ ] Configure Firebase production settings
- [ ] Set up custom domain and SSL
- [ ] Configure CORS if needed
- [ ] Enable CloudFront compression
- [ ] Set up monitoring and alarms
- [ ] Configure backup strategy for S3
- [ ] Test the deployed application
- [ ] Set up CI/CD pipeline
- [ ] Document any custom configurations

---

<div align="center">

**Made with ❤️ for ChatFlow**

[🏠 Back to README](README.md) | [🐛 Report Issue](https://github.com/tarunyadav9917/ChatFlow/issues)

</div>
