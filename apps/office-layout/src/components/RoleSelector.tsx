"use client";

import type { Role } from "@/types";

interface RoleSelectorProps {
  onAddDesk: (role: Role) => void;
  onAddDoor: () => void;
  onAddWall: () => void;
  deskCount: number;
  doorCount: number;
  wallCount: number;
}

const roles: Role[] = ["개발자", "디자이너", "대표", "부대표", "그로스팀", "기타"];

const roleColors: Record<Role, string> = {
  개발자: "#3182f6",
  디자이너: "#f97316",
  대표: "#ef4444",
  부대표: "#ec4899",
  그로스팀: "#a855f7",
  기타: "#64748b",
};

export function RoleSelector({
  onAddDesk,
  onAddDoor,
  onAddWall,
  deskCount,
  doorCount,
  wallCount,
}: RoleSelectorProps) {
  return (
    <div>
      <h2
        style={{
          fontSize: "15px",
          marginBottom: "16px",
          color: "#191f28",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
          fontWeight: "600",
          letterSpacing: "-0.2px",
        }}
      >
        요소 추가
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onAddDesk(role)}
            style={{
              padding: "12px 10px",
              background: roleColors[role],
              border: "none",
              color: "#ffffff",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "13px",
              fontWeight: "500",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {role}
          </button>
        ))}
      </div>
      <div
        style={{
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: "1px solid #f2f4f6",
        }}
      >
        <button
          onClick={onAddDoor}
          style={{
            width: "100%",
            padding: "12px 10px",
            background: "#d4a574",
            border: "none",
            color: "#ffffff",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: "500",
            transition: "opacity 0.15s ease",
            marginBottom: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          문 추가
        </button>
        <button
          onClick={onAddWall}
          style={{
            width: "100%",
            padding: "12px 10px",
            background: "#cbd5e1",
            border: "none",
            color: "#4e5968",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "13px",
            fontWeight: "500",
            transition: "opacity 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          벽 추가
        </button>
      </div>
      <div
        style={{
          padding: "12px",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#8b95a1",
          textAlign: "center",
          fontWeight: "400",
        }}
      >
        책상 {deskCount}개 · 문 {doorCount}개 · 벽 {wallCount}개
      </div>
    </div>
  );
}
