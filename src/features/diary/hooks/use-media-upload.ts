import { useState, useCallback } from 'react';

/**
 * 미디어 업로드 상태 타입
 */
export type MediaUploadState = {
  /** 업로드 중인지 여부 */
  isUploading: boolean;
  /** 업로드 진행률 (0-100) */
  progress: number;
  /** 업로드 중인 미디어 개수 */
  uploadingCount: number;
  /** 에러 메시지 */
  error: string | null;
};

/**
 * 미디어 업로드 상태 관리 훅
 *
 * 미디어 파일의 업로드 상태를 추적하고 관리합니다.
 * 업로드 중일 때는 사용자가 폼을 제출하지 못하도록 방지합니다.
 *
 * @returns 업로드 상태와 관리 함수들
 */
export const useMediaUpload = () => {
  const [uploadState, setUploadState] = useState<MediaUploadState>({
    isUploading: false,
    progress: 0,
    uploadingCount: 0,
    error: null,
  });

  /**
   * 미디어 업로드 시작
   * @param count - 업로드할 미디어 개수
   */
  const startUpload = useCallback((count: number = 1) => {
    setUploadState((prev) => ({
      ...prev,
      isUploading: true,
      uploadingCount: prev.uploadingCount + count,
      error: null,
    }));
  }, []);

  /**
   * 미디어 업로드 완료
   * @param count - 완료된 미디어 개수
   */
  const finishUpload = useCallback((count: number = 1) => {
    setUploadState((prev) => {
      const newCount = Math.max(0, prev.uploadingCount - count);
      return {
        ...prev,
        isUploading: newCount > 0,
        uploadingCount: newCount,
        progress: newCount === 0 ? 100 : prev.progress,
      };
    });
  }, []);

  /**
   * 업로드 진행률 업데이트
   * @param progress - 진행률 (0-100)
   */
  const updateProgress = useCallback((progress: number) => {
    setUploadState((prev) => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress)),
    }));
  }, []);

  /**
   * 업로드 에러 설정
   * @param error - 에러 메시지
   */
  const setError = useCallback((error: string) => {
    setUploadState((prev) => ({
      ...prev,
      error,
      isUploading: false,
      uploadingCount: 0,
    }));
  }, []);

  /**
   * 업로드 상태 초기화
   */
  const resetUpload = useCallback(() => {
    setUploadState({
      isUploading: false,
      progress: 0,
      uploadingCount: 0,
      error: null,
    });
  }, []);

  return {
    uploadState,
    startUpload,
    finishUpload,
    updateProgress,
    setError,
    resetUpload,
  };
};
