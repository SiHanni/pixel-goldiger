---
description: 기술 스택 및 아키텍처 스펙
globs: **/*
---

# Tech Stack Spec

## Architecture
- Flutter 앱 + Next.js WebView 기반
- 게임 화면은 WebView 내 Next.js 페이지로 렌더링

## Stack
- **Framework**: Next.js (TypeScript)
- **Game Engine**: TBD (Phaser.js or Canvas API)
- **Art Style**: 픽셀 아트 (도트 그래픽)

## Constraints
- WebView 환경 성능 최적화 우선
- 모바일 터치 인터랙션 고려
- 저사양 기기 대응
