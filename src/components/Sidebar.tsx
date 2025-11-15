import { map_pin, pin_clay, plus } from '../assets';

type SidebarProps = {
  locations: { id: number; name: string }[];
};

const Sidebar = ({ locations }: SidebarProps) => {
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
        {locations.map(location => (
          <li key={location.id} className="flex w-50 h-10 text-[16px]">
            <img src={pin_clay} className="w-6 h-6 mr-3" />
            {location.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
