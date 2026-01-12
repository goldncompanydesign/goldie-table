# Vercel 배포 가이드

## 방법 1: Vercel 대시보드에서 배포 (권장)

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "Add New Project" 클릭
3. GitHub 리포지토리 연결 (`goldie-bot` 선택)
4. 프로젝트 설정:
   - **Root Directory**: `apps/office-layout` (중요!)
   - **Framework Preset**: Next.js (자동 감지)
   - **Build Command**: (기본값 사용 또는 비워두기)
   - **Output Directory**: (기본값 사용)
   - **Install Command**: (기본값 사용)

5. "Deploy" 클릭

> **참고**: 모노레포이므로 **Root Directory를 `apps/office-layout`로 반드시 설정**해야 합니다!

## 방법 2: Vercel CLI 사용

```bash
# 루트 디렉토리에서
cd /Users/goldie_growth/Documents/GitHub/goldie-bot

# Vercel CLI 설치 (이미 설치되어 있으면 생략)
npm i -g vercel

# Vercel 로그인 (처음 한 번만)
vercel login

# office-layout 앱 배포
vercel --cwd apps/office-layout

# Production 배포
vercel --cwd apps/office-layout --prod
```

## 환경 변수

현재 이 프로젝트는 환경 변수가 필요하지 않습니다.

## 배포 후 확인사항

- 배포 URL에서 앱이 정상 작동하는지 확인
- 드래그 앤 드롭, 저장 기능 등 테스트
- Local Storage는 브라우저별로 별도 저장됨

## 트러블슈팅

### 빌드 에러가 발생하는 경우

1. Root Directory가 `apps/office-layout`로 설정되어 있는지 확인
2. Vercel 대시보드 → Settings → General → Root Directory 확인
3. Node.js 버전이 20 이상인지 확인 (Settings → Node.js Version)
