
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
  { id: "custom", label: "Custom", value: -1 }, // Added custom option
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

export interface ActionRequest {
  type: ActionType;
  scheduledRemovalTime: number; // time in minutes
}

// This would normally be in the environment, but for demo purposes showing how it would be used
// In a real app, this would come from import.meta.env.VITE_SIMPLEMDM_API_KEY or similar
const API_KEY = import.meta.env.VITE_SIMPLEMDM_API_KEY || "your_api_key_here";

export const triggerAction = async (request: ActionRequest): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Making SimpleMDM API call for ${request.type} action`);
    console.log(`Scheduling removal in ${request.scheduledRemovalTime} minutes`);
    
    const profileId = PROFILE_IDS[request.type];
    
    // Make the POST request to apply the profile
    const postEndpoint = `https://a.simplemdm.com/api/v1/profiles/${profileId}/devices/${DEVICE_ID}`;
    console.log(`POST to: ${postEndpoint}`);
    
    // In a real implementation, you'd make the actual API calls
    // const postResponse = await fetch(postEndpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${btoa(API_KEY + ':')}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // Schedule the removal
    if (request.scheduledRemovalTime > 0) {
      console.log(`Will remove profile in ${request.scheduledRemovalTime} minutes`);
      
      // In a real implementation, you would set up a server-side scheduled task or use a service
      // For demo purposes, we'll just log what would happen
      const deleteEndpoint = `https://a.simplemdm.com/api/v1/profiles/${profileId}/devices/${DEVICE_ID}`;
      console.log(`Will DELETE from: ${deleteEndpoint} after ${request.scheduledRemovalTime} minutes`);
      
      // Simulate the scheduled removal
      // setTimeout(() => {
      //   fetch(deleteEndpoint, {
      //     method: 'DELETE',
      //     headers: {
      //       'Authorization': `Basic ${btoa(API_KEY + ':')}`,
      //       'Content-Type': 'application/json'
      //     }
      //   });
      // }, request.scheduledRemovalTime * 60 * 1000);
    }
    
    // Simulate a successful API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
      message: "Failed to trigger action. Please try again." 
    };
  }
};
