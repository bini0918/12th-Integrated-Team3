import { DayClouds } from '../assets';
import Sidebar from '../components/Sidebar';

type Location = {
  id: number;
  name: string;
};
const Home = () => {
  const locations: Location[] = [
    { id: 1, name: '강남역 퇴근길' },
    { id: 2, name: 'RATTHAT' },
    { id: 3, name: '카페 앞' },
    { id: 4, name: '롯데월드' },
  ];
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar locations={locations} />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center ">
          <img className="h-80 w-80 mr-22 ml-22 mb-5" src={DayClouds}></img>
          <p className="font-bold text-4xl text-black">아직 선택된 위치가 없습니다!</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
