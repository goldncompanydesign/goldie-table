# Node.js 및 pnpm 설치 가이드 (macOS)

## ⚠️ 현재 상황
- Node.js가 설치되어 있지 않음
- Homebrew가 설치되어 있지 않음

## 🚀 가장 쉬운 설치 방법 (순서대로 실행)

### 1단계: Homebrew 설치

터미널에서 다음 명령어를 실행하세요:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**주의사항:**
- 설치 중 비밀번호를 물어볼 수 있습니다 (Mac 관리자 비밀번호)
- 설치가 완료될 때까지 몇 분 걸릴 수 있습니다
- 설치 완료 후 나오는 지시사항을 따라 PATH를 설정하세요 (예: `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc`)

### 2단계: Homebrew 활성화 (터미널 재시작 또는)

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

또는 터미널을 완전히 닫고 다시 열어주세요.

### 3단계: Node.js 설치

```bash
brew install node
```

### 4단계: 설치 확인

```bash
node --version
npm --version
```

정상적으로 버전이 나오면 성공입니다!

### 방법 2: nvm으로 설치 (Node Version Manager)

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 터미널 재시작 또는
source ~/.zshrc

# Node.js LTS 버전 설치
nvm install --lts
nvm use --lts

# 설치 확인
node --version
npm --version
```

### 방법 3: 공식 웹사이트에서 다운로드

1. https://nodejs.org/ 접속
2. LTS 버전 다운로드
3. 설치 프로그램 실행

## pnpm 설치

Node.js가 설치되면:

```bash
# npm으로 pnpm 설치
npm install -g pnpm

# 또는 Homebrew로
brew install pnpm

# 또는 Corepack 사용 (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# 설치 확인
pnpm --version
```

## 프로젝트 실행

설치가 완료되면:

```bash
cd /Users/goldie_growth/Documents/GitHub/goldie-bot/apps/office-layout
pnpm install
pnpm dev
```

## 문제 해결

### "command not found: node" 또는 "command not found: npm"
- Node.js가 설치되지 않았거나 PATH에 추가되지 않았습니다.
- 터미널을 재시작해보세요.
- `~/.zshrc` 파일에 Node.js 경로가 추가되어 있는지 확인하세요.

### Homebrew 명령어가 없다면
- Homebrew를 먼저 설치하거나
- 방법 2(nvm) 또는 방법 3(공식 웹사이트)을 사용하세요.
