# VividNovel Prototype

멀티 페이지 데모 사이트로 소설을 입력 받아 등장인물과 배경을 정리하고, 선택한 목소리로 장면을 재생합니다.

## 설치 및 실행
1. 의존성 설치: `npm install`
2. Gemini API 키 환경 변수 설정: `export GEMINI_API_KEY=YOUR_KEY`
3. 서버 실행: `npm start`
4. 브라우저에서 `http://localhost:3000` 접속

## 페이지 구성
- **index.html**: 소설 파일(txt, pdf) 업로드
- **characters.html**: 등장인물/배경 정보 확인 및 각 인물의 목소리 선택
- **play.html**: 소설 텍스트를 chunk로 나누어 Gemini TTS와 함께 장면을 순차적으로 표시

## 테스트
현재 자동화된 테스트는 없습니다. `npm test`를 실행하면 안내 메시지가 출력됩니다.
