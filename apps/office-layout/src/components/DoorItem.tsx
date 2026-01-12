"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Door } from "@/types";

interface DoorItemProps {
  door: Door;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  onRotate?: () => void;
}

export function DoorItem({ door, isSelected, isEditMode, onSelect, onDelete, onRotate }: DoorItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: door.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    transition: isDragging ? "none" : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <div
      ref={setNodeRef}
      data-door-item
      style={{
        position: "absolute",
        left: door.x,
        top: door.y,
        width: door.width,
        height: door.height,
        cursor: isEditMode ? "grab" : "pointer",
        ...style,
      }}
      {...(isEditMode ? listeners : {})}
      {...attributes}
      onClick={(e) => {
        if (!isDragging && onSelect) {
          onSelect();
        }
      }}
    >
      {/* 문 - 직사각형 박스 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: isSelected ? "#fef3c7" : "#fde68a",
          border: isSelected ? "2px solid #3182f6" : "2px solid #f59e0b",
          borderRadius: "6px",
        }}
      >
        {/* 문 라벨 */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "12px",
            fontWeight: "600",
            color: "#92400e",
          }}
        >
          문
        </div>
      </div>

      {/* 리사이즈 핸들 - 왼쪽 위 */}
      {isSelected && isEditMode && (
        <DoorResizeHandle door={door} position="top-left" />
      )}

      {/* 리사이즈 핸들 - 오른쪽 위 */}
      {isSelected && isEditMode && (
        <DoorResizeHandle door={door} position="top-right" />
      )}

      {/* 리사이즈 핸들 - 왼쪽 아래 */}
      {isSelected && isEditMode && (
        <DoorResizeHandle door={door} position="bottom-left" />
      )}

      {/* 리사이즈 핸들 - 오른쪽 아래 */}
      {isSelected && isEditMode && (
        <DoorResizeHandle door={door} position="bottom-right" />
      )}

      {/* 회전 버튼 */}
      {isSelected && isEditMode && onRotate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate();
          }}
          style={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            background: "#ffffff",
            border: "2px solid #3182f6",
            color: "#3182f6",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(49,130,246,0.3)",
            fontWeight: "600",
            zIndex: 10,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#3182f6";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.transform = "translateX(-50%) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = "#3182f6";
            e.currentTarget.style.transform = "translateX(-50%) scale(1)";
          }}
          title="회전"
        >
          ↻
        </button>
      )}

      {/* 삭제 버튼 */}
      {isSelected && isEditMode && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: "-16px",
            right: "-16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#ffffff",
            border: "2px solid #ef4444",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
            fontWeight: "bold",
            zIndex: 10,
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "#ef4444";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = "#ef4444";
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

function DoorResizeHandle({
  door,
  position,
}: {
  door: Door;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) {
  const handleId = `${door.id}-door-handle-${position}`;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: handleId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const handlePosition = {
    "top-left": { left: "-8px", top: "-8px", cursor: "nw-resize" },
    "top-right": { right: "-8px", top: "-8px", cursor: "ne-resize" },
    "bottom-left": { left: "-8px", bottom: "-8px", cursor: "sw-resize" },
    "bottom-right": { right: "-8px", bottom: "-8px", cursor: "se-resize" },
  }[position];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        position: "absolute",
        width: "16px",
        height: "16px",
        borderRadius: "50%",
        background: "#3182f6",
        border: "2px solid #ffffff",
        zIndex: 20,
        boxShadow: "0 2px 8px rgba(49,130,246,0.4)",
        cursor: handlePosition.cursor,
        ...handlePosition,
        ...style,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    />
  );
}
