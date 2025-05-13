
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
import { Input } from "@/components/ui/input";
import { ActionType, removalScheduleOptions } from '@/lib/simpleMdmApi';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from 'lucide-react';

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
  const [selectedOption, setSelectedOption] = useState(removalScheduleOptions[2].id); // Default to 30 minutes
  const [customMinutes, setCustomMinutes] = useState("60"); // Default custom value
  const isSafe = actionType === ActionType.SAFE;
  
  const handleConfirm = () => {
    const selectedSchedule = removalScheduleOptions.find(opt => opt.id === selectedOption);
    
    if (selectedOption === "custom") {
      const minutes = parseInt(customMinutes);
      if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid number of minutes greater than 0");
        return;
      }
      onConfirm(minutes);
    } else if (selectedSchedule) {
      onConfirm(selectedSchedule.value);
    }
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
            defaultValue={selectedOption} 
            onValueChange={setSelectedOption}
            className="flex flex-col space-y-2"
          >
            {removalScheduleOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          
          {selectedOption === "custom" && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="custom-minutes">Enter minutes:</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="custom-minutes"
                  type="number" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  min="1"
                  className="w-full"
                />
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          )}
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
