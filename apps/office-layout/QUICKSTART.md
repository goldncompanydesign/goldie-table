# 빠른 시작 가이드

## 설치 및 실행

### 1. pnpm 설치 (아직 설치하지 않았다면)

```bash
# 방법 1: npm으로 설치
npm install -g pnpm

# 방법 2: Homebrew로 설치 (macOS)
brew install pnpm

# 방법 3: Corepack 사용 (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate
```

### 2. 패키지 설치 및 실행

```bash
# 프로젝트 루트에서
cd /Users/goldie_growth/Documents/GitHub/goldie-bot
pnpm install
pnpm --filter @goldie/office-layout dev

# 또는 office-layout 디렉토리에서 직접
cd apps/office-layout
pnpm install
pnpm dev
```

### 3. 브라우저에서 접속

서버가 시작되면 **http://localhost:3001** 에서 접속하세요.

## 사용 방법

1. 우측 사이드바에서 역할을 선택하여 책상 추가
2. 책상을 드래그하여 원하는 위치로 이동
3. 책상을 클릭하여 이름과 역할 수정
4. 선택된 책상에서 × 버튼으로 삭제
5. 모든 변경사항은 자동으로 저장됩니다

## 문제 해결

### pnpm이 없다면?
```bash
npm install -g pnpm
```

### Node.js가 없다면?
```bash
brew install node
```

### 포트 3001이 이미 사용 중이라면?
`package.json`의 `dev` 스크립트에서 포트를 변경하세요:
```json
"dev": "next dev -p 3002"
```
