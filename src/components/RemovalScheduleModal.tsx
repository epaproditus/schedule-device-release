
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActionType, removalScheduleOptions } from '@/lib/simpleMdmApi';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RemovalScheduleModalProps {
  actionType: ActionType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

const RemovalScheduleModal: React.FC<RemovalScheduleModalProps> = ({
  actionType,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedTime, setSelectedTime] = useState(removalScheduleOptions[2].value); // Default to 30 minutes
  const isSafe = actionType === ActionType.SAFE;
  
  const handleConfirm = () => {
    onConfirm(selectedTime);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={isSafe ? "text-safe" : "text-emergency"}>
            Schedule {isSafe ? "Safe" : "Emergency"} Action Removal
          </DialogTitle>
          <DialogDescription>
            Select when you want this action to be automatically removed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            defaultValue={selectedTime.toString()} 
            onValueChange={(value) => setSelectedTime(parseInt(value))}
            className="flex flex-col space-y-2"
          >
            {removalScheduleOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className={isSafe ? "bg-safe hover:bg-safe-hover" : "bg-emergency hover:bg-emergency-hover"}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemovalScheduleModal;
