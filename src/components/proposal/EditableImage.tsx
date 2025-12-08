import { useRef, useState, useEffect } from "react";
import { Camera, Move, Maximize2, Upload } from "lucide-react";
import { useProposalContent, ShapeConfig } from "@/contexts/ProposalContentContext";

interface EditableImageProps {
  id: string;
  image?: string;
  onImageChange: (base64: string) => void;
  defaultConfig: ShapeConfig;
  placeholder?: string;
}

const EditableImage = ({
  id,
  image,
  onImageChange,
  defaultConfig,
  placeholder = "Upload Logo",
}: EditableImageProps) => {
  const { isEditMode, content, updateContent } = useProposalContent();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const shapeId = id;
  const shapes = content.shapes || {};
  const config = shapes[shapeId] || defaultConfig;

  const updateShape = (newConfig: Partial<ShapeConfig>) => {
    const updatedShapes = {
      ...shapes,
      [shapeId]: { ...config, ...newConfig }
    };
    updateContent("shapes", updatedShapes);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, action: "drag" | "resize") => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    if (action === "drag") {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;

      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (isDragging) {
        updateShape({
          x: config.x + dx,
          y: config.y + dy
        });
      } else if (isResizing) {
        // Maintain aspect ratio while resizing
        const newWidth = Math.max(48, config.width + dx);
        const aspectRatio = config.height / config.width;
        updateShape({
          width: newWidth,
          height: newWidth * aspectRatio
        });
      }

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, config]);

  return (
    <div
      className="relative"
      style={{
        marginLeft: config.x,
        marginTop: config.y,
        width: config.width,
        height: config.height,
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {image ? (
        <div
          className={`relative w-full h-full ${isEditMode ? 'ring-2 ring-primary/50 ring-dashed cursor-pointer' : ''}`}
          onClick={() => isEditMode && fileInputRef.current?.click()}
        >
          <img
            src={image}
            alt="Client Logo"
            className="w-full h-full object-contain"
          />
          {isEditMode && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          className={`w-full h-full rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
            isEditMode 
              ? 'bg-primary/5 cursor-pointer hover:bg-primary/10' 
              : 'bg-muted/10'
          }`}
          onClick={() => isEditMode && fileInputRef.current?.click()}
        >
          {isEditMode ? (
            <>
              <Upload className="w-6 h-6 text-primary/60" />
              <span className="text-xs text-primary/60 font-medium">{placeholder}</span>
            </>
          ) : null}
        </div>
      )}

      {isEditMode && image && (
        <>
          {/* Drag handle */}
          <div
            className="absolute -top-2 -left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center cursor-move shadow-lg z-50"
            onMouseDown={(e) => handleMouseDown(e, "drag")}
          >
            <Move className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
          
          {/* Resize handle */}
          <div
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center cursor-se-resize shadow-lg z-50"
            onMouseDown={(e) => handleMouseDown(e, "resize")}
          >
            <Maximize2 className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
        </>
      )}
    </div>
  );
};

export default EditableImage;
