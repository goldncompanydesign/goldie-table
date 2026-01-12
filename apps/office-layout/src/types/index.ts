export type Role =
  | "개발자"
  | "디자이너"
  | "대표"
  | "부대표"
  | "그로스팀"
  | "기타";

export interface Desk {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  role: Role;
  name: string;
}

export interface Door {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: "horizontal" | "vertical"; // 문의 방향
}

export interface Wall {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  direction: "horizontal" | "vertical"; // 벽의 방향
}

export interface OfficeLayoutData {
  desks: Desk[];
  doors: Door[];
  walls: Wall[];
  gridSize: number;
  lastEditedAt?: string;
}
