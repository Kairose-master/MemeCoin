# SCAM — Smart Contract Attack Museum

우리가 재현 가능한 PoC 로 증명한 사기 컨트랙트의 박물관. 그 박물관의 입장권이 pump.fun 밈코인 **SCAM** 이다.
이름이 정직하고 서사도 정직하다. **수익을 약속하지 않는다. 쓰임새를 약속한다.**

> SCAM 은 내재가치가 없는 밈코인이며 수익을 보장하지 않습니다. 언제든 0이 될 수 있습니다. 발행자는 물량을 보유하지 않고(창설 매수는 소각),
> 수수료 지갑은 공개되어 있습니다. 이 저장소는 투자 권유가 아닙니다.

| 폴더 | 내용 |
|---|---|
| `site/` | 박물관 사이트 (정적, Vercel). 전시물 12개 · 토큰 패널 · 토크노믹스 · 사용처 · 고지 |
| `launch/` | 발행 스크립트 — PumpPortal Lightning `create`, mint 키쌍 생성(`…pump` 그라인딩), 메타데이터(Pinata 또는 사이트 정적 파일), 발행 기록 |
| `promo/` | 홍보 원고 — X 스레드(발행 1 + 전시물 12), 텔레그램 고정 공지, pump.fun 설명, 기술 글, 고지문 KR/EN |
| `docs/` | 토크노믹스 · 법적 경계(무엇을 하지 않는가) · 바운티 규칙 |

## 코드에 박힌 규칙 (정직한 버전만)

- creator 물량 0 — 창설 매수는 ≤ 0.05 SOL(수수료 몫)이고 발행 직후 소각 주소로 보낸다 (`launch/burn.ts`)
- 번들 없음 · 볼륨 봇 없음 · 유료 KOL 미고지 없음 · 자전거래 없음
- 발행한 트레이딩 봇(`Kairose-master/us-trading`)은 이 mint 를 절대 사고팔지 않는다
- 수입은 pump.fun creator 수수료뿐. 용처는 공개 지갑에서 60% 바운티 풀 / 40% 프루버 인프라 / 0% 바이백

## 발행 (owner 만)

```bash
cd launch && npm i
export PUMPFUN_API_KEY=…      # PumpPortal (Lightning) API 키 — 연결된 지갑에서 dev buy + 수수료가 나간다
export PINATA_JWT=…           # 선택. 없으면 site/metadata.json 의 공개 URL 을 메타데이터 URI 로 쓴다
export SITE_URL=https://scam-museum.vercel.app
npx tsx launch.ts --dev-buy 0.01 --dry-run   # 체인에 아무것도 안 보낸다
npx tsx launch.ts --dev-buy 0.01 --confirm LAUNCH
```

발행 결과는 `site/launch.json` 에 기록되고(mint·서명·시각) 사이트가 그걸 읽어 토큰 패널을 채운다. 커밋해서 올릴 것.

## 순서

1. 채널 개설(X·텔레그램), 고지문 고정 (`promo/disclosure.md`)
2. 사이트 배포 (Vercel, `site/`)
3. `launch.ts --dry-run` → `--confirm LAUNCH` → `site/launch.json` 커밋 → 창설 매수 소각 (`burn.ts`, 지갑 비밀키는 로컬에서만)
4. `promo/x-thread-launch.md` 게시 → 전시물 스레드 주 2개
5. 첫 바운티 공고 (`docs/bounty.md`) — 풀이 0이면 발행자 시드 0.5 SOL

원본 아카이브(TRUST404)는 해커톤 심사 전까지 건드리지 않는다. 이 저장소는 그것을 **읽어 옮긴 사본**과 토큰만 다룬다.
