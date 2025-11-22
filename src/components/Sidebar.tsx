import { map_pin, pin_clay, pin_color, plus, trash_can } from '../assets';
import type { Location } from '../types/location';
type SidebarProps = {
  locations: Location[];
  selectedLocationId: number | null;
  onSelectLocation: (id: number) => void;
  onAddLocation: () => void;
  //삭제
  onDeleteLocation?: (id: number) => void;
  //핀 고정 토글
  onTogglePin: (id: number) => void;
};

const Sidebar = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onAddLocation,
  onDeleteLocation,
  onTogglePin,
}: SidebarProps) => {
  return (
    <aside className="w-60 bg-[#FFFFFF] pt-12 pb-12 pr-4 pl-4 text-black gap-10 rounded-tr-[48px] rounded-br-[48px]">
      <div className="flex gap-4">
        <img src={map_pin} alt="Map Pin" className="w-10 h-10" />
        <h2 className="mb-10 text-[20px] font-bold pt-1">위치 목록</h2>
      </div>
      <div
        className="flex gap-4 cursor-pointer mb-6 h-auto hover:bg-gray-100"
        onClick={onAddLocation}
      >
        {/*Css 수정 필요*/}
        <img src={plus} alt="plus" className="w-10 h-10 mt-4" />
        <h2 className="mt-5 mb-8 text-[20px] font-bold pt-1">추가하기</h2>

      </div>
      <ul className="pr-2 pl-2 gap-2">
        {locations.map(location => {
          const isActive = location.id === selectedLocationId;

          return (
            <li key={location.id}>
              <div className="group flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectLocation(location.id)}
                  className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-[16px] cursor-pointer ${
                    isActive ? 'bg-gray-300 text-black' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <img
                    src={location.pinned ? pin_color : pin_clay}
                    className="mr-3 h-6 w-6"
                    alt="pin"
                    onClick={e => {
                      e.stopPropagation();
                      onTogglePin && onTogglePin(location.id);
                    }}
                  />
                  <span className="truncate">{location.name}</span>
                  <img
                    src={trash_can}
                    alt="delete"
                    className="hidden w-5 h-5 cursor-pointer group-hover:block ml-auto"
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteLocation && onDeleteLocation(location.id);
                    }}
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
