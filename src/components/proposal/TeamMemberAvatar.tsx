import { useRef, useState, useEffect } from "react";
import { Camera, Move, Maximize2 } from "lucide-react";
import { useProposalContent } from "@/contexts/ProposalContentContext";

interface TeamMemberAvatarProps {
  member: { name: string; role: string; bio: string; image?: string };
  index: number;
  isEditMode: boolean;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarClick: () => void;
}

const TeamMemberAvatar = ({
  member,
  index,
  isEditMode,
  fileInputRef,
  onImageUpload,
  onAvatarClick,
}: TeamMemberAvatarProps) => {
  const { content, updateContent } = useProposalContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const shapeId = `team-avatar-${index}`;
  const shapes = content.shapes || {};
  const defaultSize = 64;
  const config = shapes[shapeId] || { x: 0, y: 0, width: defaultSize, height: defaultSize };

  const updateShape = (newConfig: Partial<typeof config>) => {
    const updatedShapes = {
      ...shapes,
      [shapeId]: { ...config, ...newConfig }
    };
    updateContent("shapes", updatedShapes);
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
        const newSize = Math.max(32, Math.min(config.width + dx, config.height + dy, 200));
        updateShape({
          width: newSize,
          height: newSize
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

  const size = config.width || defaultSize;

  return (
    <div 
      ref={containerRef}
      className="relative mb-4"
      style={{
        marginLeft: config.x,
        marginTop: config.y,
      }}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onImageUpload}
        className="hidden"
      />
      
      <div
        className={`relative ${isEditMode ? 'ring-2 ring-primary/50 ring-dashed rounded-full' : ''}`}
        style={{ width: size, height: size }}
      >
        {member.image ? (
          <div 
            className={`rounded-full overflow-hidden ${isEditMode ? 'cursor-pointer group' : ''}`}
            style={{ width: size, height: size }}
            onClick={onAvatarClick}
          >
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
            {isEditMode && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div 
            className={`rounded-full bg-primary/10 flex items-center justify-center ${isEditMode ? 'cursor-pointer group hover:bg-primary/20 transition-colors' : ''}`}
            style={{ width: size, height: size }}
            onClick={onAvatarClick}
          >
            {isEditMode ? (
              <Camera className="text-primary opacity-60 group-hover:opacity-100 transition-opacity" style={{ width: size * 0.375, height: size * 0.375 }} />
            ) : (
              <span className="font-semibold text-primary" style={{ fontSize: size * 0.375 }}>
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            )}
          </div>
        )}

        {isEditMode && (
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
    </div>
  );
};

export default TeamMemberAvatar;
