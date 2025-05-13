
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
];

export enum ActionType {
  SAFE = "safe",
  EMERGENCY = "emergency"
}

export interface ActionRequest {
  type: ActionType;
  scheduledRemovalTime: number; // time in minutes
}

// This would normally be in the environment, but for demo purposes showing how it would be used
// In a real app, this would come from import.meta.env.VITE_SIMPLEMDM_API_KEY or similar
const API_KEY = "your_api_key_here";

export const triggerAction = async (request: ActionRequest): Promise<{ success: boolean; message: string }> => {
  try {
    // For demo purposes - in a real implementation this would make actual API calls
    console.log(`Making SimpleMDM API call for ${request.type} action`);
    console.log(`Scheduling removal in ${request.scheduledRemovalTime} minutes`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you'd make the actual API call here
    // const response = await fetch('https://a.simplemdm.com/api/v1/...', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${btoa(API_KEY + ':')}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ 
    //     action_type: request.type,
    //     scheduled_removal: request.scheduledRemovalTime
    //   })
    // });
    // const data = await response.json();
    
    return { 
      success: true, 
      message: `${request.type === ActionType.SAFE ? 'Safe' : 'Emergency'} action triggered successfully. Removal scheduled in ${request.scheduledRemovalTime} minutes.` 
    };
  } catch (error) {
    console.error("Error triggering action:", error);
    return { 
      success: false, 
      message: "Failed to trigger action. Please try again." 
    };
  }
};
