# GitHub Actions Secrets Configuration for Thanksgiving Message Website

This document outlines the required secrets and variables for deploying the Thanksgiving message website using GitHub Actions.

## Required Secrets

### Docker Hub Configuration
These secrets are needed for pushing Docker images to Docker Hub registry.

#### DOCKER_USERNAME
- **Description**: Your Docker Hub username
- **Value**: Your Docker Hub account username (e.g., `johndoe`)
- **How to find**: 
  1. Go to [Docker Hub](https://hub.docker.com/)
  2. Sign in to your account
  3. Your username is displayed in the top-right corner

#### DOCKER_PASSWORD
- **Description**: Docker Hub Personal Access Token (PAT)
- **Security**: Use PAT instead of password for better security
- **How to create**:
  1. Go to [Docker Hub](https://hub.docker.com/)
  2. Sign in to your account
  3. Click on your username in the top-right corner
  4. Select "Account Settings"
  5. Navigate to "Security" tab
  6. Click "New Access Token"
  7. Give it a name (e.g., "GitHub Actions Thanksgiving Web")
  8. Set permissions (Read, Write, Delete recommended)
  9. Click "Generate"
  10. **Copy the token immediately** (you won't see it again)

### Database Configuration

#### MONGODB_URI
- **Description**: MongoDB connection string for production database
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/thanksgiving_messages?retryWrites=true&w=majority`
- **How to get**:
  1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
  2. Select your cluster
  3. Click "Connect"
  4. Choose "Connect your application"
  5. Copy the connection string
  6. Replace `<password>` with your database password

#### DB_PASSWORD (Alternative naming)
- **Description**: MongoDB database password (if using separate password secret)
- **Value**: Your MongoDB database user password

### Application Configuration

#### JWT_SECRET
- **Description**: Secret key for JWT token signing
- **Value**: A strong, random string (minimum 32 characters)
- **Generate**: Use `openssl rand -hex 32` or similar secure random generator

#### NEXT_PUBLIC_BASE_URL
- **Description**: Public base URL for the application
- **Value**: Your production domain (e.g., `https://thanksgiving-messages.com`)

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its name and value
6. Click "Add secret"

## Repository Variables (Optional)

These can be set as repository variables instead of secrets if they're not sensitive:

- `DOCKER_REGISTRY`: `docker.io` (default Docker Hub registry)
- `IMAGE_NAME`: `thanksgiving-web`
- `NODE_VERSION`: `18`

## Security Best Practices

- Never commit secrets to your repository
- Use Personal Access Tokens instead of passwords
- Regularly rotate access tokens
- Use environment-specific secrets for different deployments
- Review and audit access regularly