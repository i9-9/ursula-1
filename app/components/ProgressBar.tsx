interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-foreground/20 transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    /> 
  );
} 