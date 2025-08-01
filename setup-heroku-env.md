# Heroku Environment Setup

## Set Environment Variables in Heroku

Run these commands to configure your Heroku app:

```bash
# Set MongoDB URI
heroku config:set MONGODB_URI="mongodb+srv://wdionet:3r14F65gMv@cluster0.lvltkqp.mongodb.net/jafasol?retryWrites=true&w=majority&appName=Cluster0"

# Set JWT Secret
heroku config:set JWT_SECRET="jafasol-super-secret-jwt-key-change-this-in-production-2024"

# Set CORS Origin (for production)
heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"

# Set Node Environment
heroku config:set NODE_ENV="production"

# Set Port (Heroku will set this automatically)
heroku config:set PORT="5000"
```

## Deploy the Updated App

After setting the environment variables, redeploy:

```bash
git add .
git commit -m "Fix: Use MongoDB-compatible server for Heroku"
git push heroku main
```

## Check App Status

```bash
# View logs
heroku logs --tail

# Check app status
heroku ps

# Test the app
curl https://jafasol-backend-c364453817af.herokuapp.com/health
``` 