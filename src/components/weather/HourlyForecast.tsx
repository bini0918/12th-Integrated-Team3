import type { Location } from '../../types/location';
import { mapCondition, isDayTime, getWeatherIcon } from '../../hooks/weatherHook/useWeatherFormat';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type HourItem = {
  hour: string;
  tempC: number;
  condition: string;
  icon?: string;
};

type HourlyForecastProps = {
  location: Location;
  hours: HourItem[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 p-2 border border-gray-100 rounded-lg shadow-sm text-xs">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-600 font-bold">{payload[0].value}°C</p>
      </div>
    );
  }
  return null;
};

const CustomTick = ({ x, y, payload, hours }: any) => {
  const hourData = hours[payload.index];
  if (!hourData) return null;

  const code = mapCondition(hourData.condition);
  const dayFlag = isDayTime(hourData.hour);
  const icon = getWeatherIcon(code, dayFlag);

  return (
    <g transform={`translate(${x},${y})`}>
      <image x={-12} y={0} href={icon} width={24} height={24} />
      <text x={0} y={35} dy={0} textAnchor="middle" fill="#666" fontSize={12}>
        {payload.value}
      </text>
    </g>
  );
};

const HourlyForecast = ({ location, hours }: HourlyForecastProps) => {
  const chartData = hours.map(h => ({
    ...h,
    temp: h.tempC,
  }));

  return (
    <div className="w-5xl border-2 border-[#F2F2F2] rounded-2xl bg-white overflow-hidden">
      <h2 className="text-[20px] font-bold text-black mt-4 ml-6 mb-2">
        {location.name} 시간대별 기온
      </h2>

      <div className="w-full h-[250px] px-4 pb-2 overflow-x-auto scrollbar-hide">
        <div className="min-w-[600px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 40 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D7DFF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2D7DFF" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={<CustomTick hours={hours} />}
                interval={0}
              />

              <YAxis hide={true} domain={['dataMin - 2', 'dataMax + 2']} />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#2D7DFF', strokeWidth: 1, strokeDasharray: '5 5' }}
              />

              <Area
                type="monotone"
                dataKey="temp"
                stroke="#2D7DFF"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTemp)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
