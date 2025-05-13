
import React, { useState } from 'react';
import ActionButton from '@/components/ActionButton';
import RemovalScheduleModal from '@/components/RemovalScheduleModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { ActionType, triggerAction } from '@/lib/simpleMdmApi';
import { toast } from 'sonner';
import { Timer } from 'lucide-react';

const Index = () => {
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActionClick = (type: ActionType) => {
    setActionType(type);
    setIsConfirmationOpen(true);
  };

  const handleConfirmAction = () => {
    setIsConfirmationOpen(false);
    setIsScheduleOpen(true);
  };

  const handleScheduleConfirm = async (minutes: number) => {
    setIsScheduleOpen(false);
    setIsProcessing(true);
    
    try {
      if (!actionType) return;
      
      const result = await triggerAction({
        type: actionType,
        scheduledRemovalTime: minutes
      });
      
      if (result.success) {
        toast.success(result.message, {
          icon: <Timer className="h-4 w-4" />,
          duration: 5000,
        });
      } else {
        toast.error(result.message, {
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-center">SimpleMDM Control</h1>
      </header>
      
      <main className="flex-1 container max-w-md mx-auto p-6 flex flex-col gap-6 justify-center">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Select an action:</h2>
            <p className="text-sm text-gray-500 mb-4">
              Choose the appropriate action based on your current situation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <ActionButton 
              type={ActionType.SAFE} 
              onClick={() => handleActionClick(ActionType.SAFE)}
              disabled={isProcessing}
            />
            
            <ActionButton 
              type={ActionType.EMERGENCY} 
              onClick={() => handleActionClick(ActionType.EMERGENCY)}
              disabled={isProcessing}
            />
          </div>
          
          {isProcessing && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Processing your request...</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>© 2025 SimpleMDM Control App</p>
      </footer>
      
      {actionType && (
        <>
          <ConfirmationModal
            actionType={actionType}
            isOpen={isConfirmationOpen}
            onClose={() => setIsConfirmationOpen(false)}
            onConfirm={handleConfirmAction}
          />
          
          <RemovalScheduleModal
            actionType={actionType}
            isOpen={isScheduleOpen}
            onClose={() => setIsScheduleOpen(false)}
            onConfirm={handleScheduleConfirm}
          />
        </>
      )}
    </div>
  );
};

export default Index;
