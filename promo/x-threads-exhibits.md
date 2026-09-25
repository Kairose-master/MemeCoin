# 전시물 스레드 12개 (주 2개 게시) — 형식: 코드 한 줄 → 왜 깨지나 → 어떻게 막나 → 박물관 링크. mint 는 마지막 줄에만.

## 01 ReentrantVault — 재진입
- `msg.sender.call{value: bal}("")` 가 `balances[msg.sender] = 0` 보다 먼저.
- 받는 쪽 `receive()` 가 `withdraw()` 를 다시 부르면 잔액이 아직 그대로 — 금고가 빈다. 2016년 The DAO 가 정확히 이것.
- 막는 법: Checks-Effects-Interactions. 잔액을 먼저 0 으로, 그 다음 전송. 뮤텍스는 보험.
- 전시물: https://scam-museum-snowy.vercel.app#ReentrantVault

## 02 OpenVault — 접근 제어 누락
- `function adminWithdraw(address to, uint amount) external { … }` — `onlyOwner` 가 없다.
- 누구나 금고를 비우고 누구나 owner 를 바꾼다. 감사에서 가장 흔한 "치명적" 항목.
- 막는 법: 권한이 필요한 함수마다 modifier. 테스트에 "남이 부르면 revert" 를 반드시.

## 03 BadAccounting — 정수 언더플로
- `unchecked { balanceOf[msg.sender] -= amount; }` — 0 에서 빼면 2²⁵⁶−1.
- 0.8 의 자동 검사를 `unchecked` 가 끈다. 가스 아끼려다 무한 잔고.
- 막는 법: `unchecked` 는 증명된 곳에만. 뺄셈 앞에 `require(balance >= amount)`.

## 04 NaiveOracle — 오라클 조작
- 담보 가치를 풀의 즉시 가격으로 평가. TWAP 도 상한도 없다.
- 플래시론으로 가격을 한 블록만 띄우면 무담보 대출이 나간다.
- 막는 법: TWAP, 여러 소스, 급변 상한, 블록 지연.

## 05 DelegateVault — delegatecall 하이재킹
- `address(target).delegatecall(data)` 의 target 을 외부가 정한다.
- delegatecall 은 남의 코드를 내 스토리지에서 실행한다 — owner 슬롯을 덮어쓴다. 2017년 Parity 지갑.
- 막는 법: target 고정, 스토리지 레이아웃 잠금, 프록시 패턴은 검증된 라이브러리로.

## 06 PredictableLottery — 약한 난수
- `uint(keccak256(abi.encode(block.timestamp, block.prevrandao))) % n`.
- 같은 블록에서 누구나 같은 값을 계산한다. 이길 때만 참가하면 된다.
- 막는 법: 커밋-리빌 또는 VRF.

## 07 OpenInitializer — 미보호 initializer
- `function initialize(address admin) external { admin_ = admin; }` — 두 번 불러도 된다.
- 프록시 뒤의 구현체는 constructor 가 안 돈다. initializer 가 constructor 인데 잠금이 없으면 누구나 관리자.
- 막는 법: `initializer` modifier, `_disableInitializers()`.

## 08~12 멀쩡한 다섯 — 바운티
- SafeVault(CEI + 뮤텍스) · BoundedOwner(타임락 + 상한) · LibraryVault(고정 delegatecall) · CommitLottery(커밋-리빌) · GuardedInitializer(가드)
- 자동 프루버가 예산 안에서 못 깼다. "못 깼다" 는 "안전하다" 가 아니다. 깨면 SOL 바운티. 규칙: https://scam-museum-snowy.vercel.app/bounty
