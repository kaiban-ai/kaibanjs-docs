---
title: Deploying Your Kaiban Board
description: Learn how to deploy your Kaiban Board, a Vite-based single-page application, to various hosting platforms.
---

# Deploying Your Kaiban Board

Want to get your board online quickly? From your project's root directory, run:
```bash
npm run kaiban:deploy
```

This command will automatically build and deploy your board to Vercel's global edge network. You'll receive a unique URL for your deployment, and you can configure a custom domain later if needed.

## Manual Deployment Options

The Kaiban Board is a Vite-based single-page application (SPA) that can be deployed to any web server. Here's how to deploy manually:

### Building the Kaiban Board

1. Navigate to your `.kaiban` folder:
```bash
cd .kaiban
```

2. Install dependencies if you haven't already:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

This will create a `dist` directory with your production-ready Kaiban Board.

### Deployment Platforms

You can deploy your Kaiban Board to:

- **GitHub Pages**: Perfect for projects already hosted on GitHub
- **Netlify**: Offers automatic deployments from Git
- **Any Static Web Server**: Simply copy the contents of the `.kaiban/dist` directory to your web server's public directory
- **Docker**: Containerize your board using any lightweight web server to serve the static files

## Environment Variables

Remember to set your environment variables in your hosting platform:
```env
VITE_OPENAI_API_KEY=your_api_key_here
# Add other environment variables as needed
```

## Best Practices

1. **Build Process**
   - Always run a production build before deploying
   - Test the build locally using `npm run preview`
   - Ensure all environment variables are properly set

2. **Security**
   - Configure HTTPS for your domain
   - Set up proper CORS headers if needed
   - Keep your API keys secure

3. **Performance**
   - Enable caching for static assets
   - Configure compression
   - Use a CDN if needed

## Troubleshooting

Common deployment issues:

1. **Blank Page After Deployment**
   - Check if the base URL is configured correctly in `vite.config.js`
   - Verify all assets are being served correctly
   - Check browser console for errors

2. **Environment Variables Not Working**
   - Ensure variables are prefixed with `VITE_`
   - Rebuild the application after changing environment variables
   - Verify variables are properly set in your hosting platform

:::tip[Need Help?]
Join our [Discord community](https://kaibanjs.com/discord) for deployment support and troubleshooting assistance.
:::

:::info[We Love Feedback!]
Is there something unclear or quirky in the docs? Maybe you have a suggestion or spotted an issue? Help us refine and enhance our documentation by [submitting an issue on GitHub](https://github.com/kaiban-ai/KaibanJS/issues). We're all ears!
::: 