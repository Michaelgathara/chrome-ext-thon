![logo](readme_images/banner.png)

# Summary
A Google AI hackathon project by Michael Gathara and Jayden Pyles. Built on top of the [Chrome Extension Typescript Starter](https://github.com/chibat/chrome-extension-typescript-starter)

As you browse the web, Gemini Recommended Search scans your content and leverages Gemini's advanced capabilities to generate precise Google search queries. Instantly, you're presented with additional webpages tailored to you—allowing you to find content across the web that helps you.

## Features

### Smart Content Discovery and Content Summary
- Seamlessly discover relevant content as you browse
- Get intelligent recommendations based on your current page context
- Save time finding related resources across the web
- Get content summaries to enhance understanding

![main_use](readme_images/main_use.png)

### Powered by Gemini AI
- Advanced content analysis for precise recommendations
- Real-time query generation tailored to your interests
- High-quality results powered by Google's latest AI technology

### Simple & Privacy-Focused
- No buttons to press, works automatically when you open. 
- Full control over the domains the extension can access

![options](readme_images/options.png)

## How to run
### Prerequisites

* [node + npm](https://nodejs.org/) 
* [Docker](https://www.docker.com/)
* [Make](https://www.gnu.org/software/make/)


### Setup

- Frontend
```
npm install
```

- Backend
```
make build up
```

### Build frontend assets

```
npm run build
```

or

```
make build-ext
```

### Load extension to chrome

Load `dist` directory
