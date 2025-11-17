import { map_pin, pin_clay, plus, trash_can } from '../assets';

type SidebarProps = {
  locations: { id: number; name: string }[];
  selectedLocationId: number | null;
  onSelectLocation: (id: number) => void;
};

const Sidebar = ({ locations, selectedLocationId, onSelectLocation }: SidebarProps) => {
  return (
    <aside className="w-60 bg-[#FFFFFF] pt-12 pb-12 pr-4 pl-4 text-black gap-10 rounded-tr-[48px] rounded-br-[48px]">
      <div className="flex gap-4">
        <img src={map_pin} alt="Map Pin" className="w-10 h-10" />
        <h2 className="mb-10 text-[20px] font-bold pt-1">위치 목록</h2>
      </div>
      <div className="flex gap-4">
        <img src={plus} alt="plus" className="w-10 h-10" />
        <h2 className="mb-10 text-[20px] font-bold pt-1">추가하기</h2>
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
                  <img src={pin_clay} className="mr-3 h-6 w-6" alt="pin" />
                  <span className="truncate">{location.name}</span>
                  <img
                    src={trash_can}
                    alt="delete"
                    className="hidden w-5 h-5 cursor-pointer group-hover:block ml-auto"
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
