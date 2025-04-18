
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface StatusAlertProps {
  title: string;
  description: string;
  status: "success" | "error" | "warning" | "info";
  className?: string;
}

export function StatusAlert({ 
  title, 
  description, 
  status, 
  className 
}: StatusAlertProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };
  
  const variants = {
    success: "success",
    error: "destructive",
    warning: "warning",
    info: "info"
  };
  
  const Icon = icons[status];
  
  return (
    <Alert 
      variant={variants[status] as any} 
      className={cn("mb-4", className)}
    >
      <Icon className="h-4 w-4 mr-2" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
