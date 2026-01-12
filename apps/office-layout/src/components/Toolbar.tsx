"use client";

interface ToolbarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onClear: () => void;
  onExportPNG: () => void;
  lastEditedAt: string | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function Toolbar({
  isEditMode,
  onToggleEditMode,
  onClear,
  onExportPNG,
  lastEditedAt,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ToolbarProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px 32px",
        borderBottom: "1px solid #f2f4f6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <h1
          style={{
            fontSize: "20px",
            color: "#191f28",
            margin: 0,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
            fontWeight: "600",
            letterSpacing: "-0.3px",
          }}
        >
          회사 자리표
        </h1>
        {lastEditedAt && (
          <div
            style={{
              fontSize: "11px",
              color: "#8b95a1",
              fontWeight: "400",
            }}
          >
            최종 편집: {formatDate(lastEditedAt)}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* 줌 컨트롤 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px",
            background: "#f8f9fa",
            borderRadius: "8px",
            marginRight: "8px",
          }}
        >
          <button
            onClick={onZoomOut}
            style={{
              padding: "6px 10px",
              background: "transparent",
              border: "none",
              color: "#4e5968",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background 0.15s ease",
              minWidth: "32px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e5e8eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            −
          </button>
          <span
            style={{
              padding: "0 8px",
              fontSize: "13px",
              color: "#4e5968",
              fontWeight: "500",
              minWidth: "50px",
              textAlign: "center",
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            style={{
              padding: "6px 10px",
              background: "transparent",
              border: "none",
              color: "#4e5968",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background 0.15s ease",
              minWidth: "32px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e5e8eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            +
          </button>
          <button
            onClick={onZoomReset}
            style={{
              padding: "6px 10px",
              background: "transparent",
              border: "none",
              color: "#8b95a1",
              borderRadius: "6px",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "12px",
              fontWeight: "500",
              transition: "background 0.15s ease, color 0.15s ease",
              marginLeft: "4px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e5e8eb";
              e.currentTarget.style.color = "#4e5968";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8b95a1";
            }}
          >
            리셋
          </button>
        </div>
        <button
          onClick={onExportPNG}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: "#4e5968",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f2f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          PNG 저장
        </button>
        <button
          onClick={onToggleEditMode}
          style={{
            padding: "8px 16px",
            background: isEditMode ? "#3182f6" : "transparent",
            border: "none",
            color: isEditMode ? "#ffffff" : "#4e5968",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!isEditMode) {
              e.currentTarget.style.background = "#f2f4f6";
            }
          }}
          onMouseLeave={(e) => {
            if (!isEditMode) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {isEditMode ? "저장하기" : "수정하기"}
        </button>
        <button
          onClick={onClear}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: "#8b95a1",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fef2f2";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#8b95a1";
          }}
        >
          전체 삭제
        </button>
      </div>
    </div>
  );
}
