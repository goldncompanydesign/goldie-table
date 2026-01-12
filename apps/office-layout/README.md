# @goldie/office-layout

회사 사무실 자리표 편집기

## 개요

드래그 앤 드롭으로 책상과 의자를 배치하고, 직원 역할을 설정할 수 있는 인터랙티브한 회사 자리표 편집 도구입니다. 도트 스타일의 게임 같은 UI로 직관적인 편집이 가능합니다.

## 주요 기능

- 🎨 **도트 스타일 디자인**: 픽셀 아트 게임처럼 보이는 현대적인 UI
- 🖱️ **드래그 앤 드롭**: 마우스로 책상을 자유롭게 이동
- 👥 **역할별 색상 구분**: 개발자, 디자이너, 대표, 부대표, 그로스팀 등 역할별 색상 적용
- ✏️ **실시간 편집**: 이름과 역할을 즉시 수정 가능
- 💾 **자동 저장**: 로컬 스토리지에 자동으로 저장되어 새로고침해도 유지
- 🔒 **편집 모드**: 편집 모드 ON/OFF로 실수 방지

## 사용 방법

1. 우측 사이드바에서 역할을 선택하여 책상 추가
2. 책상을 드래그하여 원하는 위치로 이동
3. 책상을 클릭하여 이름과 역할 수정
4. 선택된 책상에서 × 버튼으로 삭제
5. 모든 변경사항은 자동으로 저장됩니다

## 스크립트

```bash
pnpm dev        # 개발 서버 (http://localhost:3001)
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버
pnpm lint       # ESLint + Prettier
pnpm typecheck  # TypeScript 타입 체크
```

## 기술 스택

- Next.js 16
- React 19
- @dnd-kit (드래그 앤 드롭)
- TypeScript

## 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── OfficeLayout.tsx    # 메인 레이아웃 컴포넌트
│   ├── DeskItem.tsx        # 책상 아이템 컴포넌트
│   ├── Grid.tsx            # 그리드 배경
│   ├── Toolbar.tsx         # 상단 툴바
│   └── RoleSelector.tsx    # 역할 선택기
└── types/
    └── index.ts            # 타입 정의
```
