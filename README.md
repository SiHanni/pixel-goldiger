# Pixel Goldiger — 광부키우기

Flutter 앱 + Next.js WebView 기반 방치형 픽셀 광부 키우기 게임 프로토타입

## 실행 방법

```bash
# 1. 레포 클론
git clone <repo-url>
cd pixel-goldiger

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 접속
open http://localhost:3000
```

## 환경변수

`.env.local` 파일에서 게임 밸런스 조정 가능:

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_EXP_TABLE` | 레벨별 필요 경험치 (쉼표 구분) |
| `NEXT_PUBLIC_MINE_INTERVAL_TABLE` | 레벨별 채굴 간격 ms (낮을수록 빠름) |
| `NEXT_PUBLIC_GOLD_PER_MINE_TABLE` | 레벨별 1회 채굴 시 골드 |
| `NEXT_PUBLIC_EXP_PER_MINE_TABLE` | 레벨별 1회 채굴 시 경험치 |

## 기술 스택

- **Next.js 15** + TypeScript
- **Phaser 3** (Canvas 렌더링, 픽셀 아트 게임 엔진)
- **React** (하단 UI 패널)

## 프로젝트 구조

```
src/
├── app/                  # Next.js App Router
├── components/
│   └── GameCanvas.tsx    # Phaser ↔ React 브릿지 + 하단 UI
└── game/
    ├── config.ts         # 게임 설정 + 레벨 데이터
    ├── state.ts          # 상태 관리 (레벨, EXP, 골드)
    ├── PhaserGame.ts     # Phaser 초기화
    ├── scenes/
    │   └── MainScene.ts  # 메인 게임 씬 (횡스크롤, 채굴)
    └── sprites/
        ├── palette.ts    # 통일 색상 팔레트
        ├── characters.ts # 레벨별 캐릭터 + 광석 스프라이트
        ├── pet.ts        # 하얀 강아지 펫
        ├── backgrounds.ts # 패럴랙스 배경 4종
        └── renderer.ts   # 픽셀→Phaser 텍스처 변환
```

## 팀원에게 공유하기

### 방법 1: Vercel (추천)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 배포 (첫 실행 시 프로젝트 설정 안내 따르기)
vercel

# 3. 프로덕션 배포
vercel --prod
```

배포 완료 후 `https://pixel-goldiger-xxx.vercel.app` URL을 팀원에게 공유.

### 방법 2: Vercel (GitHub 연동)

1. GitHub에 레포 push
2. [vercel.com](https://vercel.com) 접속 → "Import Project" → 레포 선택
3. 별도 설정 없이 "Deploy" 클릭
4. `.env.local` 값은 Vercel 대시보드 → Settings → Environment Variables에 추가

### 방법 3: ngrok (임시 공유)

```bash
# 1. 로컬 서버 실행
npm run dev

# 2. 다른 터미널에서 ngrok 실행
ngrok http 3000

# 3. 생성된 https://xxxx.ngrok.io URL 공유
```

## TODO

- [ ] Vercel 또는 ngrok으로 팀원에게 프로토타입 공유
- [ ] PM 피드백 반영
- [ ] 캐릭터/펫/배경 픽셀 퀄리티 지속 개선
- [ ] AI 이미지 생성 → Aseprite 보정으로 스프라이트 교체 (`assets/prompts/` 참고)
- [ ] 방치 시스템 (오프라인 보상)
- [ ] 앱태크 리워드 구조 설계
- [ ] 하단 탭 (장비/상점/펫) 기능 구현
- [ ] 배경 계절/시간대 전환 시스템
- [ ] Flutter WebView 연동 테스트
