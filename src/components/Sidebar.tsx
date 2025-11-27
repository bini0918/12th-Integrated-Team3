import { map_pin, pin_clay, pin_color, plus, trash_can, logout } from '../assets'; // [수정] logout_icon 추가
import type { Location } from '../types/location';

type SidebarProps = {
  locations: Location[];
  selectedLocationId: number | null;
  onSelectLocation: (id: number) => void;
  onAddLocation: () => void;
  onDeleteLocation?: (id: number) => void;
  onTogglePin: (id: number) => void;
  onLogout: () => void;
};

const Sidebar = ({
  locations,
  selectedLocationId,
  onSelectLocation,
  onAddLocation,
  onDeleteLocation,
  onTogglePin,
  onLogout,
}: SidebarProps) => {
  return (
    <aside className="w-60 bg-[#FFFFFF] pt-12 pb-8 pr-4 pl-4 text-black flex flex-col rounded-tr-[48px] rounded-br-[48px] min-h-screen">
      <div className="w-full">
        <div className="flex gap-4 mb-6">
          <img src={map_pin} alt="Map Pin" className="w-10 h-10" />
          <h2 className="text-[20px] font-bold pt-1">위치 목록</h2>
        </div>

        <div
          className="flex items-center gap-4 cursor-pointer mb-6 h-auto hover:bg-gray-100 p-2 rounded-lg transition-colors"
          onClick={onAddLocation}
        >
          <img src={plus} alt="plus" className="w-8 h-8" />
          <h2 className="text-[18px] font-bold pt-1">추가하기</h2>
        </div>

        <ul className="flex flex-col gap-2">
          {locations.map(location => {
            const isActive = location.id === selectedLocationId;
            return (
              <li key={location.id}>
                <div className="group flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectLocation(location.id)}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-[16px] cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-gray-200 text-black font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
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
                    <span className="truncate flex-1">{location.name}</span>
                    <img
                      src={trash_can}
                      alt="delete"
                      className="hidden w-5 h-5 cursor-pointer group-hover:block ml-2 opacity-60 hover:opacity-100"
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
      </div>

      <div className="mt-10 pt-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
        >
          <img src={logout} alt="logout" className="w-6 h-6 opacity-60" />
          <span className="text-[16px] font-medium">로그아웃</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
