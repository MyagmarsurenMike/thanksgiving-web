# GitHub Actions Secrets Setup Checklist

Use this checklist to ensure all required secrets and variables are properly configured for your Thanksgiving Message Website deployment.

## ✅ Pre-Setup Requirements

- [ ] GitHub repository created and accessible
- [ ] Docker Hub account created
- [ ] MongoDB Atlas cluster set up
- [ ] Production domain configured (optional)

## ✅ Docker Hub Secrets

### DOCKER_USERNAME
- [ ] Logged into Docker Hub
- [ ] Username identified: `___________________`
- [ ] Added to GitHub repository secrets

### DOCKER_PASSWORD
- [ ] Navigated to Docker Hub → Profile → Account Settings
- [ ] Clicked on "Security" tab
- [ ] Created new Personal Access Token
- [ ] Token name: `GitHub Actions Thanksgiving Web`
- [ ] Permissions set: Read, Write, Delete
- [ ] Token copied and saved securely
- [ ] Added to GitHub repository secrets
- [ ] ⚠️ Token is secure and not saved in plain text anywhere

## ✅ Database Secrets

### MONGODB_URI
- [ ] MongoDB Atlas cluster accessible
- [ ] Database user created with appropriate permissions
- [ ] Connection string obtained from "Connect" → "Connect your application"
- [ ] Password replaced in connection string
- [ ] Format verified: `mongodb+srv://username:password@cluster.mongodb.net/thanksgiving_messages?retryWrites=true&w=majority`
- [ ] Added to GitHub repository secrets

### Alternative: DB_PASSWORD (if using separate password)
- [ ] Database password identified
- [ ] Added to GitHub repository secrets

## ✅ Application Secrets

### JWT_SECRET
- [ ] Generated secure random string (32+ characters)
- [ ] Command used: `openssl rand -hex 32` or similar
- [ ] Generated secret: `___________________` (first 8 chars for verification)
- [ ] Added to GitHub repository secrets

### NEXT_PUBLIC_BASE_URL
- [ ] Production domain identified: `___________________`
- [ ] Format: `https://your-domain.com` (no trailing slash)
- [ ] Added to GitHub repository secrets or variables

## ✅ GitHub Repository Configuration

### Secrets Added
- [ ] DOCKER_USERNAME: `✓ Added`
- [ ] DOCKER_PASSWORD: `✓ Added`
- [ ] MONGODB_URI: `✓ Added`
- [ ] JWT_SECRET: `✓ Added`
- [ ] NEXT_PUBLIC_BASE_URL: `✓ Added`

### Optional Variables Added
- [ ] DOCKER_REGISTRY: `docker.io`
- [ ] IMAGE_NAME: `thanksgiving-web`
- [ ] NODE_VERSION: `18`

## ✅ Verification Steps

- [ ] All secrets show in GitHub repository settings
- [ ] No secrets contain placeholder values
- [ ] Docker Hub token has correct permissions
- [ ] MongoDB connection string is valid
- [ ] JWT secret is sufficiently complex
- [ ] Base URL uses correct protocol (https/http)

## ✅ Security Checklist

- [ ] No secrets committed to repository code
- [ ] Personal Access Token stored securely
- [ ] Database credentials use strong passwords
- [ ] JWT secret is unique and random
- [ ] Team members have appropriate access levels

## 🚀 Ready for Deployment

Once all items are checked, your GitHub Actions workflow should be able to:
- Build Docker images
- Push to Docker Hub
- Connect to MongoDB
- Deploy with proper environment configuration

---

**Next Steps:**
1. Test the GitHub Actions workflow
2. Monitor deployment logs
3. Verify application functionality in production
4. Set up monitoring and alerts