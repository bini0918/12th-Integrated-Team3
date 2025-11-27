import { useCallback, useState } from 'react';

export default function useKakaoSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState<any>(null);

  const search = useCallback(() => {
    // 1) SDK 로드 확인
    if (!window.kakao || !window.kakao.maps?.services) {
      console.warn('Kakao Maps SDK가 아직 로드되지 않았습니다.');
      return;
    }

    const ps = new window.kakao.maps.services.Places(); // 2) 검색 요청

    ps.keywordSearch(keyword, (data: any, status: any, paginationObj: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
        setPagination(paginationObj);
      } else {
        setResults([]);
        setPagination(null);
      }
    });
  }, [keyword]);

  const reset = useCallback(() => {
    setKeyword('');
    setResults([]);
    setPagination(null);
  }, []);

  return {
    keyword,
    setKeyword,
    results,
    pagination,
    search,
    reset,
  };
}
