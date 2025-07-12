# Dockerfile

# 1. Node.js LTS 버전 (20-alpine) 사용
FROM node:20-alpine

# 2. 서버 시간 한국시간으로 설정
ENV TZ=Asia/Seoul

# 3. 작업 디렉토리 생성 및 이동
WORKDIR /usr/src/app

# 4. package.json 및 package-lock.json 복사
COPY package*.json ./

# 5. 의존성 설치
RUN npm install --legacy-peer-deps

# 6. nest-cli 글로벌 설치 (마이그레이션용)
RUN npm install -g @nestjs/cli

# 7. 글로벌 npm bin 디렉토리를 PATH에 추가 (확인 필요)
ENV PATH=/usr/local/bin:$PATH

# 8. 소스 코드 복사
COPY . .

# 9. 앱 빌드
RUN npm run build

# 10. 실행 포트 노출
EXPOSE 8080

# 11. wait-for-it.sh 스크립트 복사 및 실행 권한 부여
COPY scripts/wait-for-it.sh ./scripts/wait-for-it.sh
RUN chmod +x ./scripts/wait-for-it.sh

# 12. 컨테이너 시작 명령
CMD ["/usr/src/app/scripts/wait-for-it.sh", "database:5433", "--", "sh", "-c", "exec npm run migration:run && exec npm run start:prod"]
