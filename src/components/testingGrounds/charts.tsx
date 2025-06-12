import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 2210, amt: 2290 },
  { name: 'Page C', uv: 200, pv: 2290, amt: 2000 },
  { name: 'Page D', uv: 278, pv: 2000, amt: 2181 },
  { name: 'Page E', uv: 189, pv: 2181, amt: 2500 },
  { name: 'Page F', uv: 239, pv: 2500, amt: 2100 },
  { name: 'Page G', uv: 349, pv: 2100, amt: 2300 },
  { name: 'Page H', uv: 420, pv: 2400, amt: 2400 },
];

const renderLineChart = (
  <LineChart style={{ width: '100%', height: '100%' }} width={400} height={400} data={data}>
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  </LineChart>
);
