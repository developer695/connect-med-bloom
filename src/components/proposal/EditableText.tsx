import { useState, useRef, useEffect } from "react";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

const EditableText = ({ value, onSave, className, multiline = false, placeholder = "Click to edit..." }: EditableTextProps) => {
  const { isEditMode } = useProposalContent();
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <span className={className}>{value}</span>;
  }

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input";
    return (
      <InputComponent
        ref={inputRef as any}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "bg-primary/10 border border-primary/30 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-primary/50 w-full",
          multiline && "min-h-[100px] resize-y",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer hover:bg-primary/10 rounded px-1 -mx-1 relative group inline-block transition-colors",
        className
      )}
    >
      {value || placeholder}
      <Pencil className="w-3 h-3 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 transition-opacity text-primary" />
    </span>
  );
};

export default EditableText;
