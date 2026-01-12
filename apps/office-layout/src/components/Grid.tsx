"use client";

interface GridProps {
  width: number;
  height: number;
  size: number;
}

export function Grid({ width, height, size }: GridProps) {
  // 토스 스타일의 거의 보이지 않는 미묘한 그리드
  const patternId = "floor-pattern";
  const lines = [];

  // 거의 보이지 않는 미묘한 그리드 선
  for (let x = 0; x <= width; x += size * 4) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#f2f4f6"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  for (let y = 0; y <= height; y += size * 4) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#f2f4f6"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <pattern id={patternId} width={size * 4} height={size * 4} patternUnits="userSpaceOnUse">
          <rect width={size * 4} height={size * 4} fill="#ffffff" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${patternId})`} />
      {lines}
    </svg>
  );
}
