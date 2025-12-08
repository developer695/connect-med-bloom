import { useState, useRef, useEffect } from "react";
import { useProposalContent } from "@/contexts/ProposalContentContext";
import { Move, Maximize2 } from "lucide-react";

interface ShapeConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EditableShapeProps {
  id: string;
  defaultConfig: ShapeConfig;
  className?: string;
  children?: React.ReactNode;
}

const EditableShape = ({ id, defaultConfig, className = "", children }: EditableShapeProps) => {
  const { isEditMode, content, updateContent } = useProposalContent();
  const shapeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Get saved config or use defaults
  const shapes = (content as any).shapes || {};
  const config: ShapeConfig = shapes[id] || defaultConfig;

  const updateShape = (newConfig: Partial<ShapeConfig>) => {
    const updatedShapes = {
      ...shapes,
      [id]: { ...config, ...newConfig }
    };
    updateContent("shapes" as any, updatedShapes);
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
        updateShape({
          width: Math.max(32, config.width + dx),
          height: Math.max(32, config.height + dy)
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
      ref={shapeRef}
      className={`absolute ${className} ${isEditMode ? 'ring-2 ring-primary/50 ring-dashed' : ''}`}
      style={{
        left: config.x,
        top: config.y,
        width: config.width,
        height: config.height,
      }}
    >
      {children}
      
      {isEditMode && (
        <>
          {/* Drag handle */}
          <div
            className="absolute -top-3 -left-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-move shadow-lg z-50"
            onMouseDown={(e) => handleMouseDown(e, "drag")}
          >
            <Move className="w-3 h-3 text-primary-foreground" />
          </div>
          
          {/* Resize handle */}
          <div
            className="absolute -bottom-3 -right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-se-resize shadow-lg z-50"
            onMouseDown={(e) => handleMouseDown(e, "resize")}
          >
            <Maximize2 className="w-3 h-3 text-primary-foreground" />
          </div>
        </>
      )}
    </div>
  );
};

export default EditableShape;
