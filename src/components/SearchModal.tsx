import { DayWind, close } from '../assets';

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
  onSelect: (p: Place) => void;
  onClose: () => void;
}

export default function SearchModal({
  open,
  keyword,
  results,
  pagination,
  onChangeKeyword,
  onSearch,
  onSelect,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[#292E2E]/60 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-xl rounded-2xl p-8 shadow-xl relative">
        <div className="flex py-4 px-5  flex-col items-start gap-4 rounded-2xl">
          <img src={DayWind} alt="날씨 아이콘" className="w-20 h-20" />
          <span className="text-black font-bold text-2xl mb-4">날씨 위치 추가</span>
        </div>
        <button onClick={onClose} className="absolute right-3 top-3 text-xl">
          <img src={close} alt="close" className="w-6 h-6" />
        </button>

        <div className="flex gap-2 mb-4">
          <input
            className="border flex-1 px-2 py-1 rounded"
            value={keyword}
            onChange={e => onChangeKeyword(e.target.value)}
            placeholder="장소 검색"
          />
          <button
            onClick={onSearch}
            className="bg-[#32A1FF] text-white px-4 py-1 rounded cursor-pointer"
          >
            검색
          </button>
        </div>
        <hr className="mb-2 border" />

        <ul>
          {results.slice(0, 5).map(p => (
            <li
              key={p.id}
              className="border-b p-2 cursor-pointer hover:bg-[#F6F6F6]"
              onClick={() => onSelect(p)}
            >
              <div className="font-semibold">{p.place_name}</div>
              <div className="text-sm text-gray-500">{p.road_address_name || p.address_name}</div>
            </li>
          ))}
        </ul>
        {pagination && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: pagination.last }, (_, i) => {
              const page = i + 1;
              const isActive = pagination.current === page;

              return (
                <button
                  key={page}
                  onClick={() => pagination.gotoPage(page)}
                  className={`px-2 py-1 rounded cursor-pointer
                    ${isActive ? 'bg-[#32A1FF] text-white' : 'bg-gray-200'}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
