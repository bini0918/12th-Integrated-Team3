import { useCallback, useState } from 'react';

export default function useKakaoSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState<any>(null);

  const search = () => {
    const { kakao } = window;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data: any, status: any, pagination: any) => {
      if (status === kakao.maps.services.Status.OK) {
        setResults(data);
        setPagination(pagination);
      } else {
        setResults([]);
        setPagination(null);
      }
    });
  };

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
