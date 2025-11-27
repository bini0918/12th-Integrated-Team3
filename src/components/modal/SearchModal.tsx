import { useState } from 'react';
import { DayWind, close, check, search } from '../../assets';
import { motion } from 'framer-motion';

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
}

interface Props {
  open: boolean;
  keyword: string;
  results: Place[];
  pagination: any | null;
  onChangeKeyword: (v: string) => void;
  onSearch: () => void;
  onSelect: (p: Place) => void; // 최종 선택된 장소 전달
  onClose: () => void;
}

export default function SearchModal({
  keyword,
  results,
  pagination,
  onChangeKeyword,
  onSearch,
  onSelect,
  onClose,
}: Props) {
  // 선택된 장소 관리
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Enter 키 입력 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  // 최종 확인 버튼
  const handleConfirm = () => {
    if (selectedPlace) {
      onSelect(selectedPlace); // 부모에 전달
      // onClose(); // 모달 닫기
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#292E2E]/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <motion.div
        className="bg-white w-[90%] max-w-xl rounded-2xl p-8 shadow-xl relative"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {/* 상단 아이콘 + 타이틀 */}
        <div className="flex items-start gap-3 mb-4">
          <img src={DayWind} alt="날씨 아이콘" className="w-20 h-20 mr-2" />
          <span className="text-black font-bold text-3xl tracking-tight mt-7 px-2">
            날씨 위치 추가
          </span>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 hover:scale-110 transition-transform"
        >
          <img
            src={close}
            alt="close"
            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
          />
        </button>

        {/* 검색창 */}
        <div className="flex gap-3">
          <input
            className="flex-1 px-4 py-1 rounded-lg focus:outline-none focus:ring-2"
            value={keyword}
            onChange={e => onChangeKeyword(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 적용
            placeholder="장소 검색"
          />
          <button
            onClick={onSearch}
            className="text-white px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition cursor-pointer"
          >
            <img src={search} alt="search" className="w-6 h-6 aspect-square" />
          </button>
        </div>

        <hr className="border border-gray-300 mb-10" />

        {/* 검색 결과 */}
        <div className="border-2 border-[#A4A4A4] rounded-xl overflow-hidden">
          <ul>
            {results.slice(0, 3).map(p => (
              <li
                key={p.id}
                className="flex items-center justify-between px-4 py-4 border-b last:border-none hover:bg-[#F6F6F6] transition cursor-pointer"
                onClick={() => setSelectedPlace(p)} // 리스트 영역 클릭도 선택 가능
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[16px] text-gray-900">{p.place_name}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    {p.road_address_name || p.address_name}
                  </span>
                </div>

                {/* 체크 상태 표시 */}
                <img
                  src={check}
                  alt="select"
                  className={`w-5 h-5 transition ${
                    selectedPlace?.id === p.id ? 'opacity-100' : 'opacity-20'
                  }`}
                  onClick={e => {
                    e.stopPropagation(); // 부모 클릭 막기
                    setSelectedPlace(p);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* 페이지네이션 */}
        {pagination && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.last }, (_, i) => {
              const page = i + 1;
              const active = pagination.current === page;

              return (
                <button
                  key={page}
                  onClick={() => pagination.gotoPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition cursor-pointer
                    ${active ? 'bg-black text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}

        {/* 확인 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleConfirm}
            className="bg-black text-white px-5 py-2 rounded-lg font-semibold hover:brightness-110 transition cursor-pointer"
          >
            확인
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
