"use client";

import { useState, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Desk, Role, Door, Wall, OfficeLayoutData } from "@/types";
import { Grid } from "./Grid";
import { DeskItem } from "./DeskItem";
import { DoorItem } from "./DoorItem";
import { WallItem } from "./WallItem";
import { Toolbar } from "./Toolbar";
import { RoleSelector } from "./RoleSelector";

const GRID_SIZE = 20;
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 2000;

function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function OfficeLayout() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const [selectedWall, setSelectedWall] = useState<Wall | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedDesk, setDraggedDesk] = useState<Desk | null>(null);
  const [draggedDoor, setDraggedDoor] = useState<Door | null>(null);
  const [draggedWall, setDraggedWall] = useState<Wall | null>(null);
  const [lastEditedAt, setLastEditedAt] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("office-layout");
      if (saved) {
        try {
          const data: OfficeLayoutData = JSON.parse(saved);
          setDesks(data.desks || []);
          setDoors(data.doors || []);
          setWalls(data.walls || []);
          setLastEditedAt(data.lastEditedAt || null);
        } catch (e) {
          console.error("Failed to load layout:", e);
        }
      }
    }
  }, []);

  // 데이터 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (desks.length > 0 || doors.length > 0 || walls.length > 0 || localStorage.getItem("office-layout")) {
        const now = new Date().toISOString();
        setLastEditedAt(now);
        const data: OfficeLayoutData = {
          desks,
          doors,
          walls,
          gridSize: GRID_SIZE,
          lastEditedAt: now,
        };
        localStorage.setItem("office-layout", JSON.stringify(data));
      }
    }
  }, [desks, doors, walls]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const desk = desks.find((d) => d.id === active.id);
    const door = doors.find((d) => d.id === active.id);
    const wall = walls.find((w) => w.id === active.id);
    if (desk) {
      setDraggedDesk(desk);
    } else if (door) {
      setDraggedDoor(door);
    } else if (wall) {
      setDraggedWall(wall);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id as string;

    if (delta) {
      // 리사이즈 핸들 처리 - 벽 (4개 코너)
      if (id.includes("-handle-") && !id.includes("-door-handle-")) {
        const parts = id.split("-handle-");
        if (parts.length === 2) {
          const wallId = parts[0];
          const position = parts[1] as "top-left" | "top-right" | "bottom-left" | "bottom-right";
          const wall = walls.find((w) => w.id === wallId);
          if (wall) {
            let newX = wall.x;
            let newY = wall.y;
            let newWidth = wall.width;
            let newHeight = wall.height;

            // 코너 핸들에 따른 크기 및 위치 조정
            if (position === "top-left") {
              newX = snapToGrid(wall.x + delta.x, GRID_SIZE);
              newY = snapToGrid(wall.y + delta.y, GRID_SIZE);
              newWidth = Math.max(40, snapToGrid(wall.width - delta.x, GRID_SIZE));
              newHeight = Math.max(20, snapToGrid(wall.height - delta.y, GRID_SIZE));
            } else if (position === "top-right") {
              newY = snapToGrid(wall.y + delta.y, GRID_SIZE);
              newWidth = Math.max(40, snapToGrid(wall.width + delta.x, GRID_SIZE));
              newHeight = Math.max(20, snapToGrid(wall.height - delta.y, GRID_SIZE));
            } else if (position === "bottom-left") {
              newX = snapToGrid(wall.x + delta.x, GRID_SIZE);
              newWidth = Math.max(40, snapToGrid(wall.width - delta.x, GRID_SIZE));
              newHeight = Math.max(20, snapToGrid(wall.height + delta.y, GRID_SIZE));
            } else if (position === "bottom-right") {
              newWidth = Math.max(40, snapToGrid(wall.width + delta.x, GRID_SIZE));
              newHeight = Math.max(20, snapToGrid(wall.height + delta.y, GRID_SIZE));
            }

            // 경계 체크
            newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - newWidth));
            newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - newHeight));
            newWidth = Math.min(newWidth, CANVAS_WIDTH - newX);
            newHeight = Math.min(newHeight, CANVAS_HEIGHT - newY);

            setWalls((prev) =>
              prev.map((w) =>
                w.id === wallId
                  ? {
                      ...w,
                      x: newX,
                      y: newY,
                      width: newWidth,
                      height: newHeight,
                    }
                  : w
              )
            );
            setActiveId(null);
            return;
          }
        }
      }

      // 리사이즈 핸들 처리 - 문 (4개 코너)
      if (id.includes("-door-handle-")) {
        const parts = id.split("-door-handle-");
        if (parts.length === 2) {
          const doorId = parts[0];
          const position = parts[1] as "top-left" | "top-right" | "bottom-left" | "bottom-right";
          const door = doors.find((d) => d.id === doorId);
          if (door) {
            let newX = door.x;
            let newY = door.y;
            let newWidth = door.width;
            let newHeight = door.height;

            // 코너 핸들에 따른 크기 및 위치 조정
            if (position === "top-left") {
              newX = snapToGrid(door.x + delta.x, GRID_SIZE);
              newY = snapToGrid(door.y + delta.y, GRID_SIZE);
              newWidth = Math.max(40, snapToGrid(door.width - delta.x, GRID_SIZE));
              newHeight = Math.max(40, snapToGrid(door.height - delta.y, GRID_SIZE));
            } else if (position === "top-right") {
              newY = snapToGrid(door.y + delta.y, GRID_SIZE);
              newWidth = Math.max(40, snapToGrid(door.width + delta.x, GRID_SIZE));
              newHeight = Math.max(40, snapToGrid(door.height - delta.y, GRID_SIZE));
            } else if (position === "bottom-left") {
              newX = snapToGrid(door.x + delta.x, GRID_SIZE);
              newWidth = Math.max(40, snapToGrid(door.width - delta.x, GRID_SIZE));
              newHeight = Math.max(40, snapToGrid(door.height + delta.y, GRID_SIZE));
            } else if (position === "bottom-right") {
              newWidth = Math.max(40, snapToGrid(door.width + delta.x, GRID_SIZE));
              newHeight = Math.max(40, snapToGrid(door.height + delta.y, GRID_SIZE));
            }

            // 경계 체크
            newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - newWidth));
            newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - newHeight));
            newWidth = Math.min(newWidth, CANVAS_WIDTH - newX);
            newHeight = Math.min(newHeight, CANVAS_HEIGHT - newY);

            setDoors((prev) =>
              prev.map((d) =>
                d.id === doorId
                  ? {
                      ...d,
                      x: newX,
                      y: newY,
                      width: newWidth,
                      height: newHeight,
                    }
                  : d
              )
            );
            setActiveId(null);
            return;
          }
        }
      }

      const desk = desks.find((d) => d.id === id);
      if (desk) {
        const newX = snapToGrid(desk.x + delta.x, GRID_SIZE);
        const newY = snapToGrid(desk.y + delta.y, GRID_SIZE);
        const snappedX = Math.max(0, Math.min(newX, CANVAS_WIDTH - desk.width));
        const snappedY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - desk.height));
        setDesks((prev) => prev.map((d) => (d.id === id ? { ...d, x: snappedX, y: snappedY } : d)));
      }

      const door = doors.find((d) => d.id === id);
      if (door) {
        const newX = snapToGrid(door.x + delta.x, GRID_SIZE);
        const newY = snapToGrid(door.y + delta.y, GRID_SIZE);
        const snappedX = Math.max(0, Math.min(newX, CANVAS_WIDTH - door.width));
        const snappedY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - door.height));
        setDoors((prev) => prev.map((d) => (d.id === id ? { ...d, x: snappedX, y: snappedY } : d)));
      }

      const wall = walls.find((w) => w.id === id);
      if (wall) {
        const newX = snapToGrid(wall.x + delta.x, GRID_SIZE);
        const newY = snapToGrid(wall.y + delta.y, GRID_SIZE);
        const snappedX = Math.max(0, Math.min(newX, CANVAS_WIDTH - wall.width));
        const snappedY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - wall.height));
        setWalls((prev) => prev.map((w) => (w.id === id ? { ...w, x: snappedX, y: snappedY } : w)));
      }
    }

    setActiveId(null);
    setDraggedDesk(null);
    setDraggedDoor(null);
    setDraggedWall(null);
  };

  const handleAddDesk = (role: Role) => {
    const newDesk: Desk = {
      id: `desk-${Date.now()}`,
      x: snapToGrid(100, GRID_SIZE),
      y: snapToGrid(100, GRID_SIZE),
      width: 180,
      height: 100,
      role,
      name: `${role} ${desks.filter((d) => d.role === role).length + 1}`,
    };
    setDesks((prev) => [...prev, newDesk]);
  };

  const handleDeleteDesk = (id: string) => {
    setDesks((prev) => prev.filter((d) => d.id !== id));
    if (selectedDesk?.id === id) {
      setSelectedDesk(null);
    }
  };

  const handleUpdateDesk = (updatedDesk: Desk) => {
    setDesks((prev) => prev.map((d) => (d.id === updatedDesk.id ? updatedDesk : d)));
    setSelectedDesk(updatedDesk);
  };

  const handleAddDoor = () => {
    const newDoor: Door = {
      id: `door-${Date.now()}`,
      x: snapToGrid(100, GRID_SIZE),
      y: snapToGrid(100, GRID_SIZE),
      width: 120,
      height: 180,
      direction: "vertical",
    };
    setDoors((prev) => [...prev, newDoor]);
  };

  const handleDeleteDoor = (id: string) => {
    setDoors((prev) => prev.filter((d) => d.id !== id));
    if (selectedDoor?.id === id) {
      setSelectedDoor(null);
    }
  };

  const handleUpdateDoor = (updatedDoor: Door) => {
    setDoors((prev) => prev.map((d) => (d.id === updatedDoor.id ? updatedDoor : d)));
    setSelectedDoor(updatedDoor);
  };

  const handleRotateDoor = (doorId: string) => {
    setDoors((prev) =>
      prev.map((d) =>
        d.id === doorId
          ? {
              ...d,
              direction: d.direction === "horizontal" ? "vertical" : "horizontal",
              // 방향 변경 시 width와 height를 교환
              width: d.height,
              height: d.width,
            }
          : d
      )
    );
    const door = doors.find((d) => d.id === doorId);
    if (door) {
      setSelectedDoor({
        ...door,
        direction: door.direction === "horizontal" ? "vertical" : "horizontal",
        width: door.height,
        height: door.width,
      });
    }
  };

  const handleAddWall = () => {
    const newWall: Wall = {
      id: `wall-${Date.now()}`,
      x: snapToGrid(100, GRID_SIZE),
      y: snapToGrid(100, GRID_SIZE),
      width: 300,
      height: 20,
      direction: "horizontal",
    };
    setWalls((prev) => [...prev, newWall]);
  };

  const handleDeleteWall = (id: string) => {
    setWalls((prev) => prev.filter((w) => w.id !== id));
    if (selectedWall?.id === id) {
      setSelectedWall(null);
    }
  };

  const handleUpdateWall = (updatedWall: Wall) => {
    setWalls((prev) => prev.map((w) => (w.id === updatedWall.id ? updatedWall : w)));
    setSelectedWall(updatedWall);
  };

  const handleRotateWall = (wallId: string) => {
    setWalls((prev) =>
      prev.map((w) =>
        w.id === wallId
          ? {
              ...w,
              direction: w.direction === "horizontal" ? "vertical" : "horizontal",
              // 방향 변경 시 width와 height를 교환
              width: w.height,
              height: w.width,
            }
          : w
      )
    );
    const wall = walls.find((w) => w.id === wallId);
    if (wall) {
      setSelectedWall({
        ...wall,
        direction: wall.direction === "horizontal" ? "vertical" : "horizontal",
        width: wall.height,
        height: wall.width,
      });
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleZoomReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeId) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("[data-desk-item]") ||
      target.closest("[data-door-item]") ||
      target.closest("[data-wall-item]") ||
      target === canvasRef.current
    ) {
      return;
    }
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isPanning && !activeId) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isPanning, panStart, activeId]);

  const handleExportPNG = async () => {
    if (!canvasRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `office-layout-${new Date().toISOString().split("T")[0]}.png`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("PNG 내보내기에 실패했습니다. html2canvas를 설치해주세요.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onClear={() => {
          setDesks([]);
          setDoors([]);
          setWalls([]);
          setSelectedDesk(null);
          setSelectedDoor(null);
          setSelectedWall(null);
        }}
        onExportPNG={handleExportPNG}
        lastEditedAt={lastEditedAt}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />
      <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#f8f9fa" }}>
        <div
          ref={containerRef}
          className="pan-area"
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            cursor: isPanning ? "grabbing" : "grab",
            paddingRight: "200px",
          }}
          onMouseDown={handleMouseDown}
        >
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
              ref={canvasRef}
              style={{
                position: "relative",
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                background: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #f2f4f6",
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: "0 0",
                transition: isPanning ? "none" : "transform 0.2s ease",
                margin: "32px",
              }}
            >
              <Grid width={CANVAS_WIDTH} height={CANVAS_HEIGHT} size={GRID_SIZE} />
              {walls.map((wall) => (
                <WallItem
                  key={wall.id}
                  wall={wall}
                  isSelected={selectedWall?.id === wall.id}
                  isEditMode={isEditMode}
                  onSelect={() => setSelectedWall(wall)}
                  onDelete={() => handleDeleteWall(wall.id)}
                  onRotate={() => handleRotateWall(wall.id)}
                />
              ))}
              {doors.map((door) => (
                <DoorItem
                  key={door.id}
                  door={door}
                  isSelected={selectedDoor?.id === door.id}
                  isEditMode={isEditMode}
                  onSelect={() => setSelectedDoor(door)}
                  onDelete={() => handleDeleteDoor(door.id)}
                  onRotate={() => handleRotateDoor(door.id)}
                />
              ))}
              {desks.map((desk) => (
                <DeskItem
                  key={desk.id}
                  desk={desk}
                  isSelected={selectedDesk?.id === desk.id}
                  isEditMode={isEditMode}
                  onSelect={() => setSelectedDesk(desk)}
                  onDelete={() => handleDeleteDesk(desk.id)}
                />
              ))}
            </div>
            <DragOverlay>
              {draggedDesk ? (
                <DeskItem desk={draggedDesk} isSelected={false} isEditMode={false} />
              ) : draggedDoor ? (
                <DoorItem door={draggedDoor} isSelected={false} isEditMode={false} />
              ) : draggedWall ? (
                <WallItem wall={draggedWall} isSelected={false} isEditMode={false} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        <div
          style={{
            width: "320px",
            background: "#ffffff",
            padding: "24px",
            overflowY: "auto",
            borderLeft: "1px solid #f2f4f6",
          }}
        >
          {isEditMode && (
            <RoleSelector
              onAddDesk={handleAddDesk}
              onAddDoor={handleAddDoor}
              onAddWall={handleAddWall}
              deskCount={desks.length}
              doorCount={doors.length}
              wallCount={walls.length}
            />
          )}
          {selectedDesk && (
            <DeskEditor
              desk={selectedDesk}
              onUpdate={handleUpdateDesk}
              onClose={() => setSelectedDesk(null)}
            />
          )}
          {selectedWall && (
            <WallEditor
              wall={selectedWall}
              onUpdate={handleUpdateWall}
              onClose={() => setSelectedWall(null)}
            />
          )}
          {selectedDoor && (
            <DoorEditor
              door={selectedDoor}
              onUpdate={handleUpdateDoor}
              onClose={() => setSelectedDoor(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DeskEditor({
  desk,
  onUpdate,
  onClose,
}: {
  desk: Desk;
  onUpdate: (desk: Desk) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(desk.name);
  const [role, setRole] = useState<Role>(desk.role);

  useEffect(() => {
    setName(desk.name);
    setRole(desk.role);
  }, [desk]);

  const handleSave = () => {
    onUpdate({ ...desk, name, role });
  };

  const roles: Role[] = ["개발자", "디자이너", "대표", "부대표", "그로스팀", "기타"];

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #f2f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            color: "#191f28",
            fontWeight: "600",
            margin: 0,
            letterSpacing: "-0.2px",
          }}
        >
          책상 편집
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#8b95a1",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: "1",
            padding: "4px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f2f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          역할
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            cursor: "pointer",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238b95a1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            paddingRight: "32px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#3182f6",
          border: "none",
          color: "#ffffff",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "14px",
          fontWeight: "500",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2563eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#3182f6";
        }}
      >
        저장
      </button>
    </div>
  );
}

function WallEditor({
  wall,
  onUpdate,
  onClose,
}: {
  wall: Wall;
  onUpdate: (wall: Wall) => void;
  onClose: () => void;
}) {
  const [length, setLength] = useState(wall.direction === "horizontal" ? wall.width : wall.height);
  const [direction, setDirection] = useState<"horizontal" | "vertical">(wall.direction);

  useEffect(() => {
    setLength(wall.direction === "horizontal" ? wall.width : wall.height);
    setDirection(wall.direction);
  }, [wall]);

  const handleSave = () => {
    const updatedWall: Wall = {
      ...wall,
      width: direction === "horizontal" ? snapToGrid(length, GRID_SIZE) : 20,
      height: direction === "vertical" ? snapToGrid(length, GRID_SIZE) : 20,
      direction,
    };
    onUpdate(updatedWall);
  };

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #f2f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            color: "#191f28",
            fontWeight: "600",
            margin: 0,
            letterSpacing: "-0.2px",
          }}
        >
          벽 편집
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#8b95a1",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: "1",
            padding: "4px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f2f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          방향
        </label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as "horizontal" | "vertical")}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            cursor: "pointer",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238b95a1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            paddingRight: "32px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        >
          <option value="horizontal">가로</option>
          <option value="vertical">세로</option>
        </select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          길이 (픽셀)
        </label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={40}
          max={2000}
          step={GRID_SIZE}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        />
      </div>
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#3182f6",
          border: "none",
          color: "#ffffff",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "14px",
          fontWeight: "500",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2563eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#3182f6";
        }}
      >
        저장
      </button>
    </div>
  );
}

function DoorEditor({
  door,
  onUpdate,
  onClose,
}: {
  door: Door;
  onUpdate: (door: Door) => void;
  onClose: () => void;
}) {
  const [width, setWidth] = useState(door.width);
  const [height, setHeight] = useState(door.height);
  const [direction, setDirection] = useState<"horizontal" | "vertical">(door.direction);

  useEffect(() => {
    setWidth(door.width);
    setHeight(door.height);
    setDirection(door.direction);
  }, [door]);

  const handleSave = () => {
    const updatedDoor: Door = {
      ...door,
      width: snapToGrid(width, GRID_SIZE),
      height: snapToGrid(height, GRID_SIZE),
      direction,
    };
    onUpdate(updatedDoor);
  };

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        background: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #f2f4f6",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            fontSize: "15px",
            color: "#191f28",
            fontWeight: "600",
            margin: 0,
            letterSpacing: "-0.2px",
          }}
        >
          문 편집
        </h3>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#8b95a1",
            cursor: "pointer",
            fontSize: "20px",
            lineHeight: "1",
            padding: "4px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f2f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          ×
        </button>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          방향
        </label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as "horizontal" | "vertical")}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            cursor: "pointer",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%238b95a1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
            paddingRight: "32px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        >
          <option value="horizontal">가로</option>
          <option value="vertical">세로</option>
        </select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          너비 (픽셀)
        </label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          min={40}
          max={500}
          step={GRID_SIZE}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "6px",
            color: "#4e5968",
            fontWeight: "500",
            fontSize: "13px",
            letterSpacing: "-0.1px",
          }}
        >
          높이 (픽셀)
        </label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          min={40}
          max={500}
          step={GRID_SIZE}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "#f8f9fa",
            border: "1px solid #f2f4f6",
            color: "#191f28",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: "14px",
            transition: "border-color 0.15s ease, background 0.15s ease",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#3182f6";
            e.currentTarget.style.background = "#ffffff";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#f2f4f6";
            e.currentTarget.style.background = "#f8f9fa";
          }}
        />
      </div>
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: "#3182f6",
          border: "none",
          color: "#ffffff",
          borderRadius: "8px",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "14px",
          fontWeight: "500",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2563eb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#3182f6";
        }}
      >
        저장
      </button>
    </div>
  );
}
