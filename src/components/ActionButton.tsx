
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionType } from '@/lib/simpleMdmApi';
import { Shield, ShieldAlert } from 'lucide-react';

interface ActionButtonProps {
  type: ActionType;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  type, 
  onClick, 
  disabled = false 
}) => {
  const isSafe = type === ActionType.SAFE;
  
  return (
    <Button
      className={cn(
        "relative w-full h-32 text-xl font-bold rounded-xl transition-all duration-200 shadow-lg flex flex-col items-center justify-center gap-3",
        isSafe 
          ? "bg-safe hover:bg-safe-hover" 
          : "bg-emergency hover:bg-emergency-hover",
        disabled && "opacity-70 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {isSafe ? (
        <Shield className="h-10 w-10" />
      ) : (
        <ShieldAlert className="h-10 w-10" />
      )}
      <span>{isSafe ? "Safe" : "Emergency"}</span>
    </Button>
  );
};

export default ActionButton;
