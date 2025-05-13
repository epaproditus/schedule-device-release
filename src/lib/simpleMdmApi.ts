
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

// Backend API URL - can be configured via environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

// Track scheduled removals
const scheduledRemovals: Record<string, number> = {};

export const triggerAction = async (request: ActionRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Making API call for ${request.type} action`);
    console.log(`Will schedule removal in ${request.scheduledRemovalTime} minutes`);
    
    const profileId = PROFILE_IDS[request.type];
    
    // Call our backend proxy to apply the profile
    const applyResponse = await fetch(`${BACKEND_URL}/profiles/${profileId}/devices/${DEVICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ actionType: request.type })
    });
    
    if (!applyResponse.ok) {
      const errorData = await applyResponse.json();
      throw new Error(errorData.message || 'Failed to apply profile');
    }
    
    const responseData = await applyResponse.json();
    
    // Schedule the removal if a time is specified
    if (request.scheduledRemovalTime > 0) {
      console.log(`Will remove profile in ${request.scheduledRemovalTime} minutes`);
      
      // Create a unique ID for this removal task
      const removalId = `${profileId}-${DEVICE_ID}-${Date.now()}`;
      
      // Store the timeout ID so it can be canceled if needed
      const timeoutId = window.setTimeout(async () => {
        console.log(`Executing scheduled removal: ${removalId}`);
        
        try {
          const removeResponse = await fetch(`${BACKEND_URL}/profiles/${profileId}/devices/${DEVICE_ID}`, {
            method: 'DELETE'
          });
          
          if (removeResponse.ok) {
            console.log(`Successfully removed profile ${profileId} from device ${DEVICE_ID}`);
          } else {
            const errorData = await removeResponse.json();
            console.error(`Failed to remove profile: ${errorData.message}`);
          }
          
        } catch (error) {
          console.error("Error during scheduled removal:", error);
        } finally {
          // Remove this task from tracking
          delete scheduledRemovals[removalId];
        }
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
      }` 
    };
  } catch (error) {
    console.error("Error triggering action:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to trigger action. Please try again."
    };
  }
};
