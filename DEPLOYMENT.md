# 🚀 Deployment Guide

## Bolt Hosting Deployment

This project is configured for automatic deployment to Bolt Hosting using GitHub Actions.

### Automatic Deployment

1. **Push to main/master branch** - Triggers automatic deployment
2. **Pull Request** - Runs quality checks and build verification
3. **Manual deployment** - Can be triggered from GitHub Actions tab

### Setup Instructions

#### 1. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

**Required Secrets:**
- `BOLT_TOKEN` - Your Bolt Hosting deployment token

#### 2. Environment Variables

For the Python backend (if deploying separately):
- `FIRECRAWL_API_KEY` - Firecrawl API key for web scraping
- `HUGGINGFACEHUB_API_TOKEN` - HuggingFace API token
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `COLLEGE_WEBSITE_URL` - College website URL to crawl

#### 3. Build Configuration

The deployment uses the following build settings:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18.x

### Manual Deployment

To deploy manually:

```bash
# Build the project
npm run build

# Deploy using Bolt CLI (if available)
bolt deploy
```

### Deployment Status

Check deployment status:
- GitHub Actions tab for build logs
- Bolt Hosting dashboard for live status
- Pull request checks for quality verification

### Troubleshooting

#### Build Failures
1. Check GitHub Actions logs
2. Verify all dependencies are in package.json
3. Ensure TypeScript compilation passes locally

#### Deployment Issues
1. Verify Bolt token is correctly set
2. Check build output directory exists
3. Ensure no build errors in logs

#### Environment Issues
1. Verify all required environment variables are set
2. Check API keys are valid and active
3. Test backend connectivity if using full URAG setup

### Production Considerations

#### Frontend Only Deployment
- Uses mock data for demonstration
- No backend dependencies required
- Fast deployment and loading

#### Full Stack Deployment
- Requires Python backend setup
- Vector database initialization needed
- API keys and external services required

### Monitoring

Monitor your deployment:
- **Performance:** Check loading times and responsiveness
- **Errors:** Monitor console for JavaScript errors
- **API:** Test all chat functionality
- **Mobile:** Verify responsive design works

### Rollback

If issues occur:
1. Revert the problematic commit
2. Push to main branch to trigger redeployment
3. Or use Bolt Hosting dashboard to rollback

---

## Local Development

For local development setup:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run quality checks
npm run lint
npm run type-check
npm run build
```

## Support

For deployment issues:
- Check GitHub Actions logs
- Review Bolt Hosting documentation
- Contact support if needed