/**
 * 개발용 데이터베이스 초기화 스크립트
 *
 * 데이터베이스 스키마 변경으로 인한 문제를 해결하기 위해
 * 기존 데이터베이스를 삭제하고 새로 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// Expo 캐시 디렉토리들
const cacheDirectories = ['.expo', 'node_modules/.cache'];

// SQLite 데이터베이스 파일들 (시뮬레이터/에뮬레이터 캐시에 저장됨)
const dbCacheMessage = `
📱 데이터베이스 초기화 완료!

⚠️  중요: 시뮬레이터/에뮬레이터에서 앱을 완전히 삭제하고 재설치하세요:

iOS 시뮬레이터:
1. 앱 아이콘을 길게 눌러 삭제
2. 또는 Device > Erase All Content and Settings

Android 에뮬레이터:
1. 앱을 길게 눌러 삭제
2. 또는 Settings > Apps에서 MindMate 삭제

그 다음 다시 'npx expo start'로 앱을 실행하세요.
`;

function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ 삭제됨: ${dirPath}`);
  }
}

function resetDatabase() {
  console.log('🔄 데이터베이스 캐시 초기화 중...\n');

  // 캐시 디렉토리 삭제
  cacheDirectories.forEach(deleteDirectory);

  console.log(dbCacheMessage);
}

// 스크립트 실행
resetDatabase();
