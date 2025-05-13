
# SimpleMDM Proxy Server

This is a simple proxy server that handles API calls to SimpleMDM, avoiding CORS issues that would occur when calling directly from a browser.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file from the example:
```
cp .env.example .env
```

3. Edit `.env` and add your SimpleMDM API key:
```
SIMPLEMDM_API_KEY=your_api_key_here
```

4. Start the server:
```
npm start
```

## Development

To run with auto-reloading on code changes:
```
npm run dev
```

## API Endpoints

- `POST /api/profiles/:profileId/devices/:deviceId` - Apply a profile to a device
- `DELETE /api/profiles/:profileId/devices/:deviceId` - Remove a profile from a device
- `GET /health` - Health check endpoint

## Environment Variables

- `SIMPLEMDM_API_KEY` - Your SimpleMDM API key
- `PORT` - The port the server will run on (default: 3000)
- `FRONTEND_URL` - The URL of your frontend application (for CORS, default: all origins allowed)
