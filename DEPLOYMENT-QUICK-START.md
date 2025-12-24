# 🚀 Quick Deployment Reference

Quick reference guide for deploying ChatFlow to AWS.

## 📚 Full Documentation

For complete deployment instructions, see **[AWS-DEPLOYMENT.md](AWS-DEPLOYMENT.md)**

---

## ⚡ Quick Start

### 1. AWS Amplify (Easiest - 5 minutes)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

**Or use Amplify Console:**
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Amplify will auto-detect settings from `amplify.yml`
5. Add environment variables in Amplify Console
6. Deploy automatically on every push!

---

### 2. S3 + CloudFront (Most Cost-Effective)

**Prerequisites:**
- AWS CLI configured (`aws configure`)
- S3 bucket created
- CloudFront distribution created

**Deploy:**
```bash
# Configure deploy-s3.sh with your bucket name and distribution ID
nano deploy-s3.sh

# Make executable (already done)
chmod +x deploy-s3.sh

# Deploy!
./deploy-s3.sh
```

**Manual Deploy:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

### 3. GitHub Actions (Automated CI/CD)

1. **Setup:**
   ```bash
   # Copy the workflow file
   cp .github/workflows/deploy-aws.yml.example .github/workflows/deploy-aws.yml
   ```

2. **Add GitHub Secrets:**
   - Go to: Repository Settings → Secrets and variables → Actions
   - Add required secrets (see `.github/workflows/deploy-aws.yml.example`)

3. **Deploy:**
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy
   - Check progress in Actions tab

---

## 🔐 Environment Variables

Copy and configure:
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

**Required Variables:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 🌐 Custom Domain

### For Amplify:
1. Amplify Console → Domain management
2. Add domain and follow instructions
3. SSL certificate auto-provisioned

### For CloudFront:
1. Request SSL in ACM (us-east-1 region)
2. Add domain to CloudFront distribution
3. Update DNS records (A record → CloudFront)

---

## 📊 After Deployment

**Test your deployment:**
```bash
# Test the build locally first
npm run build
npm run preview
```

**Verify deployment:**
- Check all pages load correctly
- Test authentication flow
- Verify environment variables are working
- Test on mobile devices
- Check SSL certificate

**Monitor:**
- CloudWatch metrics (if using CloudFront)
- Amplify Console logs (if using Amplify)
- Check for 404/403 errors

---

## 💰 Cost Estimates

| Service | Free Tier | Small App | Medium App |
|---------|-----------|-----------|------------|
| **S3 + CloudFront** | $0 (first year) | ~$5/mo | ~$15/mo |
| **AWS Amplify** | 1000 build min free | ~$15/mo | ~$40/mo |
| **Elastic Beanstalk** | 750 hrs free | ~$30/mo | ~$100/mo |

---

## 🆘 Troubleshooting

### Build fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not working
- Ensure variables start with `VITE_`
- Check they're set during build time
- Verify in built files: `grep -r "VITE_" dist/`

### 404 errors on refresh (SPA routing)
- Configure CloudFront error pages
- Set 403 and 404 to redirect to index.html with 200 status

### CloudFront not updating
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"
```

---

## 📱 Deployment Checklist

- [ ] Test build locally
- [ ] Configure environment variables
- [ ] Set up AWS account and CLI
- [ ] Create S3 bucket (for S3 deployment)
- [ ] Create CloudFront distribution (for S3 deployment)
- [ ] Configure custom domain and SSL
- [ ] Set up monitoring and alarms
- [ ] Test deployed application
- [ ] Set up CI/CD (optional)
- [ ] Document custom configurations

---

## 🔗 Helpful Links

- [Full AWS Deployment Guide](AWS-DEPLOYMENT.md)
- [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
- [AWS S3 Console](https://console.aws.amazon.com/s3/)
- [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
- [Firebase Console](https://console.firebase.google.com/)

---

## 💬 Need Help?

- 📖 Read the [full deployment guide](AWS-DEPLOYMENT.md)
- 🐛 Check [Troubleshooting section](AWS-DEPLOYMENT.md#-troubleshooting)
- 💬 [Open an issue](https://github.com/tarunyadav9917/ChatFlow/issues)

---

**Happy Deploying! 🚀**
