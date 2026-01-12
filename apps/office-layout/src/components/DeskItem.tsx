"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { Desk, Role } from "@/types";

interface DeskItemProps {
  desk: Desk;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

// 토스 스타일의 깔끔하고 부드러운 색상
const roleColors: Record<Role, { desk: string; monitor: string; chair: string; accent: string; badge: string }> = {
  개발자: {
    desk: "#f0f9ff",
    monitor: "#0ea5e9",
    chair: "#bae6fd",
    accent: "#0284c7",
    badge: "#3182f6",
  },
  디자이너: {
    desk: "#fff7ed",
    monitor: "#f97316",
    chair: "#fed7aa",
    accent: "#ea580c",
    badge: "#f97316",
  },
  대표: {
    desk: "#fef2f2",
    monitor: "#ef4444",
    chair: "#fecaca",
    accent: "#dc2626",
    badge: "#ef4444",
  },
  부대표: {
    desk: "#fdf2f8",
    monitor: "#ec4899",
    chair: "#fbcfe8",
    accent: "#db2777",
    badge: "#ec4899",
  },
  그로스팀: {
    desk: "#faf5ff",
    monitor: "#a855f7",
    chair: "#e9d5ff",
    accent: "#9333ea",
    badge: "#a855f7",
  },
  기타: {
    desk: "#f8fafc",
    monitor: "#64748b",
    chair: "#cbd5e1",
    accent: "#475569",
    badge: "#64748b",
  },
};

export function DeskItem({
  desk,
  isSelected,
  isEditMode,
  onSelect,
  onDelete,
}: DeskItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: desk.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    transition: isDragging ? "none" : "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const colors = roleColors[desk.role] || roleColors.기타;

  return (
    <div
      ref={setNodeRef}
      data-desk-item
      style={{
        position: "absolute",
        left: desk.x,
        top: desk.y,
        width: desk.width,
        height: desk.height,
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
      {/* 책상 테이블 - 심플한 가로 직사각형 */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "65%",
          bottom: "35%",
          background: colors.desk,
          border: isSelected
            ? `2px solid ${colors.accent}`
            : `1px solid ${colors.chair}`,
          borderRadius: "12px",
          boxShadow: isSelected
            ? `0 4px 20px ${colors.accent}20, 0 2px 8px rgba(0,0,0,0.08)`
            : "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* 책상 상단 하이라이트 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "20%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)",
            borderRadius: "12px 12px 0 0",
          }}
        />
      </div>

      {/* 맥북 형태 - 예쁘게 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "8%",
          transform: "translateX(-50%)",
          width: "50%",
          height: "38%",
        }}
      >
        {/* 맥북 화면 (열린 상태) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "85%",
            height: "70%",
            background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
            border: `2px solid ${colors.accent}`,
            borderRadius: "8px 8px 2px 2px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.1)",
          }}
        >
          {/* 화면 내부 */}
          <div
            style={{
              position: "absolute",
              top: "6px",
              left: "4px",
              right: "4px",
              bottom: "4px",
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* 맥북 노치 (상단 중앙) */}
            <div
              style={{
                position: "absolute",
                top: "2px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "25%",
                height: "8px",
                background: "#000",
                borderRadius: "0 0 6px 6px",
              }}
            />
            {/* 화면 반사 */}
            <div
              style={{
                position: "absolute",
                top: "12px",
                left: "6px",
                width: "45%",
                height: "35%",
                background: "linear-gradient(135deg, rgba(255,255,255,0.12), transparent)",
                borderRadius: "4px 0 0 0",
              }}
            />
          </div>
        </div>
        {/* 맥북 베이스/키보드 부분 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: "8%",
            background: colors.monitor,
            border: `2px solid ${colors.accent}`,
            borderRadius: "0 0 8px 8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {/* 트랙패드 영역 */}
          <div
            style={{
              position: "absolute",
              bottom: "2px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "30%",
              height: "60%",
              background: "rgba(0,0,0,0.2)",
              borderRadius: "4px",
            }}
          />
        </div>
        {/* 맥북 연결 부분 (화면과 베이스 사이) */}
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5%",
            height: "3%",
            background: colors.accent,
            borderRadius: "0 0 2px 2px",
          }}
        />
      </div>

      {/* 의자 - 심플하게 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "8%",
          transform: "translateX(-50%)",
          width: "32%",
          height: "22%",
        }}
      >
        {/* 의자 등받이 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "48%",
            background: colors.chair,
            border: `1.5px solid ${colors.accent}`,
            borderRadius: "8px 8px 4px 4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        />
        {/* 의자 좌석 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: colors.chair,
            border: `1.5px solid ${colors.accent}`,
            borderRadius: "4px 4px 8px 8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      </div>

      {/* 책상 이름 라벨 - 토스 스타일 */}
      <div
        style={{
          position: "absolute",
          bottom: "-26px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "13px",
          color: "#191f28",
          textAlign: "center",
          fontWeight: "600",
          background: "#ffffff",
          padding: "6px 12px",
          borderRadius: "8px",
          border: "1px solid #e5e8eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          letterSpacing: "-0.2px",
        }}
      >
        {desk.name}
      </div>

      {/* 역할 배지 - 토스 스타일 */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "11px",
          color: "#ffffff",
          background: colors.badge,
          padding: "5px 10px",
          borderRadius: "12px",
          fontWeight: "600",
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          pointerEvents: "none",
          letterSpacing: "-0.1px",
        }}
      >
        {desk.role}
      </div>

      {/* 삭제 버튼 - 토스 스타일 */}
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
