
export interface RemovalScheduleOption {
  id: string;
  label: string;
  value: number; // time in minutes
}

export const removalScheduleOptions: RemovalScheduleOption[] = [
  { id: "5min", label: "5 minutes", value: 5 },
  { id: "15min", label: "15 minutes", value: 15 },
  { id: "30min", label: "30 minutes", value: 30 },
  { id: "1hour", label: "1 hour", value: 60 },
  { id: "2hours", label: "2 hours", value: 120 },
  { id: "4hours", label: "4 hours", value: 240 },
  { id: "8hours", label: "8 hours", value: 480 },
  { id: "custom", label: "Custom", value: -1 }, // Custom option
];

export enum ActionType {
  SAFE = "safe",
  EMERGENCY = "emergency"
}

// Profile IDs for each action type
export const PROFILE_IDS = {
  [ActionType.SAFE]: "173628",
  [ActionType.EMERGENCY]: "173535"
};

// Device ID
export const DEVICE_ID = "1845292";

// Assignment Group ID - This is a placeholder and should be updated if known
export const ASSIGNMENT_GROUP_ID = "default";

export interface ActionRequest {
  type: ActionType;
  scheduledRemovalTime: number; // time in minutes
}

// This would normally be in the environment, but for demo purposes showing how it would be used
const API_KEY = import.meta.env.VITE_SIMPLEMDM_API_KEY || "your_api_key_here";

// Track scheduled removals
const scheduledRemovals: Record<string, number> = {};

export const triggerAction = async (request: ActionRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Making SimpleMDM API call for ${request.type} action`);
    console.log(`Scheduling removal in ${request.scheduledRemovalTime} minutes`);
    
    const profileId = PROFILE_IDS[request.type];
    
    // Due to CORS restrictions, we need to simulate the API call for demonstration
    // In a real implementation, these API calls would be made from a server-side component
    // or through a proxy API that has proper CORS headers set up
    
    console.log(`Would POST to: https://a.simplemdm.com/api/v1/profiles/${profileId}/devices/${DEVICE_ID}`);
    console.log(`Using API Key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 3)}`);
    
    // Simulate a successful API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Schedule the removal if a time is specified
    if (request.scheduledRemovalTime > 0) {
      console.log(`Would remove profile in ${request.scheduledRemovalTime} minutes`);
      console.log(`Would DELETE from: https://a.simplemdm.com/api/v1/profiles/${profileId}/devices/${DEVICE_ID} after ${request.scheduledRemovalTime} minutes`);
      
      // Create a unique ID for this removal task
      const removalId = `${profileId}-${DEVICE_ID}-${Date.now()}`;
      
      // Store the timeout ID so it can be canceled if needed
      const timeoutId = window.setTimeout(() => {
        console.log(`Executing scheduled removal simulation: ${removalId}`);
        console.log(`Would DELETE profile ${profileId} from device ${DEVICE_ID} now`);
        
        // Remove this task from tracking
        delete scheduledRemovals[removalId];
      }, request.scheduledRemovalTime * 60 * 1000);
      
      // Track this removal
      scheduledRemovals[removalId] = timeoutId;
    }
    
    return { 
      success: true, 
      message: `${request.type === ActionType.SAFE ? 'Safe' : 'Emergency'} action triggered successfully. ${
        request.scheduledRemovalTime > 0 
          ? `Removal scheduled in ${request.scheduledRemovalTime} minutes.`
          : 'No automatic removal scheduled.'
      } (Note: API call simulated due to CORS restrictions)` 
    };
  } catch (error) {
    console.error("Error triggering action:", error);
    return { 
      success: false, 
      message: "Failed to trigger action. Please try again. (Note: API calls are simulated for demonstration purposes)" 
    };
  }
};
