
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ActionType } from '@/lib/simpleMdmApi';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  actionType: ActionType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  actionType,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const isSafe = actionType === ActionType.SAFE;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isSafe ? "text-safe" : "text-emergency"}>
            Confirm {isSafe ? "Safe" : "Emergency"} Action
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to trigger the {isSafe ? "Safe" : "Emergency"} action?
            {!isSafe && " This should only be used in emergency situations."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              isSafe 
                ? "bg-safe hover:bg-safe-hover" 
                : "bg-emergency hover:bg-emergency-hover"
            )}
            onClick={onConfirm}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
