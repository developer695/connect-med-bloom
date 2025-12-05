import { cn } from "@/lib/utils";
import logoBlack from "@/assets/unifimed-logo-black.png";
import logoWhite from "@/assets/unifimed-logo-white.png";

interface UnifiMedLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  className?: string;
}

const UnifiMedLogo = ({ size = "md", variant = "dark", className }: UnifiMedLogoProps) => {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16",
  };

  const logo = variant === "dark" ? logoBlack : logoWhite;

  return (
    <img
      src={logo}
      alt="UnifiMed"
      className={cn(sizes[size], "w-auto object-contain", className)}
    />
  );
};

export default UnifiMedLogo;
