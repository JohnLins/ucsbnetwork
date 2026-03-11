export function OrbDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <div className="h-3 w-3 rounded-full bg-accent animate-gold-pulse" />
    </div>
  );
}
