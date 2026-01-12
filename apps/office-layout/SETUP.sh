#!/bin/bash

# 회사 자리표 앱 설정 스크립트

echo "🚀 회사 자리표 앱 설정을 시작합니다..."
echo ""

# Homebrew 설치 확인
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew가 설치되어 있지 않습니다."
    echo "📦 Homebrew를 설치합니다..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Apple Silicon Mac의 경우
    if [ -d "/opt/homebrew" ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    
    echo "✅ Homebrew 설치 완료"
else
    echo "✅ Homebrew가 이미 설치되어 있습니다."
fi

# Node.js 설치 확인
if ! command -v node &> /dev/null; then
    echo "📦 Node.js를 설치합니다..."
    brew install node
    echo "✅ Node.js 설치 완료"
else
    echo "✅ Node.js가 이미 설치되어 있습니다: $(node --version)"
fi

# pnpm 설치 확인
if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm을 설치합니다..."
    npm install -g pnpm
    echo "✅ pnpm 설치 완료"
else
    echo "✅ pnpm이 이미 설치되어 있습니다: $(pnpm --version)"
fi

echo ""
echo "🎉 모든 설정이 완료되었습니다!"
echo ""
echo "다음 명령어로 프로젝트를 실행하세요:"
echo "  cd $(pwd)"
echo "  pnpm install"
echo "  pnpm dev"
echo ""
