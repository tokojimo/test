import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const data = [
  { day: '01/09', score: 42 },
  { day: '02/09', score: 55 },
  { day: '03/09', score: 31 },
  { day: '04/09', score: 70 },
  { day: '05/09', score: 49 }
];

export default function AppearingLineChart() {
  return (
    <AnimatePresence>
      <motion.section
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        style={{ width: '100%', height: 300 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
            <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ background: '#111827', border: 'none', borderRadius: 4, color: '#fff' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4ade80"
              dot={false}
              isAnimationActive
              animationBegin={200}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.section>
    </AnimatePresence>
  );
}
