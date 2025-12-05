import { cn } from "@/lib/utils";

interface UnifiMedLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UnifiMedLogo = ({ size = "md", className }: UnifiMedLogoProps) => {
  const sizes = {
    sm: { container: "w-10 h-10", dots: "w-0.5 h-0.5", text: "text-xl" },
    md: { container: "w-12 h-12", dots: "w-1 h-1", text: "text-2xl" },
    lg: { container: "w-16 h-16", dots: "w-1.5 h-1.5", text: "text-4xl" },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full border-4 border-primary flex items-center justify-center",
            sizes[size].container
          )}
        >
          <div className="flex flex-col gap-0.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={cn("rounded-sm bg-primary", sizes[size].dots)}
                style={{ transform: `scale(${1 - i * 0.15})` }}
              />
            ))}
          </div>
        </div>
      </div>
      <span className={cn("font-heading font-bold text-foreground", sizes[size].text)}>
        UnifiMed
      </span>
    </div>
  );
};

export default UnifiMedLogo;
