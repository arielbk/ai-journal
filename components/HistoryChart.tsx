'use client';

import { Analysis } from '@prisma/client';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

const CustomTooltip = ({ payload, label, active }: any) => {
  const dateLabel = new Date(label).toLocaleString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  if (active) {
    const analysis = payload![0].payload as unknown as Analysis;
    return (
      <div className="custom-tooltip relative rounded-lg border border-black/10 bg-white/5 p-4 shadow-md backdrop-blur-md">
        <div
          className="absolute bottom-2 right-2 h-3 w-3 rounded-full"
          style={{ background: analysis.color }}
        />
        <p className="label text-sm text-white/30">{dateLabel}</p>
        <p className=" text-xl font-semibold capitalize">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

const HistoryChart = ({ data }: { data: Analysis[] }) => {
  return (
    <ResponsiveContainer width={'100%'} height="100%">
      <LineChart width={300} height={100} data={data}>
        <Line
          dataKey="sentimentScore"
          type="monotone"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <XAxis dataKey="createdAt" />
        <Tooltip content={CustomTooltip} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
