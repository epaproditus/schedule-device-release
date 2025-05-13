
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// Parse JSON request bodies
app.use(express.json());

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  const apiKey = process.env.SIMPLEMDM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, message: 'SimpleMDM API key not configured on server' });
  }
  req.apiKey = apiKey;
  next();
};

// Apply profile to device
app.post('/api/profiles/:profileId/devices/:deviceId', checkApiKey, async (req, res) => {
  try {
    const { profileId, deviceId } = req.params;
    const response = await axios({
      method: 'POST',
      url: `https://a.simplemdm.com/api/v1/profiles/${profileId}/devices/${deviceId}`,
      auth: {
        username: req.apiKey,
        password: ''
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Successfully applied profile ${profileId} to device ${deviceId}`);
    res.json({ success: true, message: 'Profile applied successfully', data: response.data });
  } catch (error) {
    console.error('Error applying profile:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.response?.data?.errors?.join(', ') || 'Failed to apply profile',
      error: error.message
    });
  }
});

// Remove profile from device
app.delete('/api/profiles/:profileId/devices/:deviceId', checkApiKey, async (req, res) => {
  try {
    const { profileId, deviceId } = req.params;
    const response = await axios({
      method: 'DELETE',
      url: `https://a.simplemdm.com/api/v1/profiles/${profileId}/devices/${deviceId}`,
      auth: {
        username: req.apiKey,
        password: ''
      }
    });
    
    console.log(`Successfully removed profile ${profileId} from device ${deviceId}`);
    res.json({ success: true, message: 'Profile removed successfully', data: response.data });
  } catch (error) {
    console.error('Error removing profile:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.response?.data?.errors?.join(', ') || 'Failed to remove profile',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`SimpleMDM proxy server running on port ${port}`);
});
