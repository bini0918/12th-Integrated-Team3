## 🚀 프로젝트 실행 방법 (Getting Started)

이 프로젝트는 `Vite` + `React` 기반으로 제작되었습니다. 아래 순서대로 실행해 주세요.

### 1. 환경 변수 설정 (.env)

프로젝트 루트 경로에 `.env` 파일을 생성하고, **Kakao Maps API 키**를 입력해야 정상적으로 지도가 로드됩니다.

```bash
# .env 파일 생성 후 아래 내용 입력
VITE_KAKAO_APP_KEY=6181094c2dd1171acbb420a973bc705c
```

### 2. 접속 확인

- 개발 서버가 실행되면 터미널에 표시되는 주소로 접속해 주세요. 기본 포트는 5173이지만, 사용 중일 경우 5174, 5175 등으로 자동 변경될 수 있습니다.
- 기본 접속 주소: http://localhost:5173
- (포트 점유 시): http://localhost:5174 또는 http://localhost:5175
- 이외 포트는 실행 안됩니다!

## 📝 구현 내용 요약

### 1. 날씨 데이터 시각화 (Weather & Chart)

- **시간별 날씨 그래프 (`recharts` 적용)**
  - API에서 제공하는 시간별 데이터가 1시간 단위가 아닌 **3시간 단위**로 제공됨에 따라, 이를 효과적으로 보여주기 위해 `recharts` 라이브러리의 `AreaChart`를 활용하여 부드러운 곡선 형태로 시각화했습니다.
  - 그래프에 마우스 오버 시 툴팁을 통해 구체적인 온도를 확인할 수 있도록 구현했습니다.
- **주간 날씨 예보**
  - 주간 날씨 API 응답에 구체적인 날짜(월/일) 정보가 포함되지 않는 문제가 있었습니다.
  - 이를 해결하기 위해 클라이언트 기준(`new Date()`)으로 오늘 날짜로부터 순차적으로 날짜를 계산하여 매핑하는 로직을 추가했습니다.
- **자외선 지수 처리**
  - 현재 날씨 API 응답값에 자외선(UV) 데이터가 존재하지 않아, UI 구성을 위해 임의의 값('보통')을 기본값으로 설정해 두었습니다.

### 2. 위치 검색 및 관리 (Map & Modal)

- **카카오 장소 검색 (`Kakao Maps SDK`)**
  - `window.kakao.maps.services.Places`를 사용하여 키워드 검색 기능을 구현했습니다.
  - 검색 결과가 많을 경우를 대비하여 **페이지네이션(Pagination)** 기능을 모달 내에 구현했습니다.

### 3. 사용자 인증 및 폼 핸들링 (Auth)

- **Form Validation**
  - `react-hook-form`과 `zod`, `@hookform/resolvers`를 조합하여 로그인 및 회원가입 폼의 유효성 검사를 처리했습니다.
  - 이메일 형식 및 비밀번호 길이 제한 등을 관리합니다.
- **로그아웃**
  - 로그아웃 시 `Tanstack Query`의 캐시를 초기화(`queryClient.clear()`)하고 스토어 상태를 리셋한 뒤 로그인 페이지로 이동하도록 처리했습니다.

### 4. 비동기 처리 및 성능 최적화

- **Suspense 적용**
  - 데이터 로딩 시 사용자 경험(UX)을 저해하지 않도록 `React Suspense`와 `LoadingFallback` 컴포넌트를 적용하여 로딩 상태를 선언적으로 처리했습니다.

---

## 🤔 고민한 점 & 트러블 슈팅

**1. 날씨 상태 매핑 로직 (`useWeatherFormat.ts`)**

- API에서 내려주는 `condition` 문자열(예: "light rain", "overcast clouds")을 앱 내 아이콘 및 상태 코드(`WeatherCode`)로 변환하는 과정이 필요했습니다.
- 현재는 `includes()` 메서드를 사용하여 특정 키워드(rain, snow, clear 등)가 포함되어 있는지를 검사하는 **문자열 매칭 방식**으로 구현했습니다.
- 모든 케이스를 커버하기 위해 `Map` 구조와 조건문을 혼용했는데, 더 효율적이고 정확한 매핑 방식이 있을지 알려주시면 감사하겠습니다!

---

## 📚 기술 스택 (Tech Stack)

- **Framework**: React, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Framer Motion (Modal Animation)
- **State Management**: Zustand
- **Async State**: Tanstack Query (React Query)
- **Form**: React Hook Form, Zod
- **Visualization**: Recharts

---

## 🔗 참고 자료 (References)

- **API Swagger**: [Swagger UI](http://3.34.231.145:8080/swagger-ui/index.html#/)
- **Kakao Maps API**: [Keyword Search Sample](https://apis.map.kakao.com/web/sample/keywordList/)
