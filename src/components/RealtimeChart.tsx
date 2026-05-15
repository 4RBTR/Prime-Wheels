"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_DATA = [
  { time: '10:00', traffic: 120 },
  { time: '10:01', traffic: 154 },
  { time: '10:02', traffic: 189 },
  { time: '10:03', traffic: 165 },
  { time: '10:04', traffic: 210 },
  { time: '10:05', traffic: 280 },
  { time: '10:06', traffic: 230 },
  { time: '10:07', traffic: 260 },
  { time: '10:08', traffic: 190 },
  { time: '10:09', traffic: 290 },
  { time: '10:10', traffic: 320 },
  { time: '10:11', traffic: 340 },
  { time: '10:12', traffic: 280 },
  { time: '10:13', traffic: 390 },
  { time: '10:14', traffic: 410 },
];

export default function RealtimeChart() {
  const [data, setData] = useState(INITIAL_DATA);
  const [currentValue, setCurrentValue] = useState(INITIAL_DATA[INITIAL_DATA.length - 1].traffic);

  // Simulate Real-time Data Heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [...currentData];
        // Remove oldest data point
        newData.shift();
        
        // Generate new timestamp (fake minute increment)
        const lastTime = newData[newData.length - 1].time;
        const [hours, minutes] = lastTime.split(':').map(Number);
        const newMinutes = (minutes + 1) % 60;
        const newHours = minutes + 1 >= 60 ? (hours + 1) % 24 : hours;
        const nextTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        
        // Generate new random traffic closely related to the last one
        const lastTraffic = newData[newData.length - 1].traffic;
        const fluctuation = Math.floor(Math.random() * 80) - 30; // Random change between -30 to +50
        const newTraffic = Math.max(10, lastTraffic + fluctuation); 
        
        newData.push({ time: nextTime, traffic: newTraffic });
        setCurrentValue(newTraffic);
        
        return newData;
      });
    }, 2500); // Pulse every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full h-[400px] flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Live Platform Traffic</h3>
          <p className="text-slate-500 text-sm font-medium">Tracking active users checking car catalogs right now</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Real-time</span>
          </div>
          <span className="text-4xl font-black text-slate-900 tracking-tighter transition-all duration-500">{currentValue}</span>
          <span className="text-slate-500 text-sm ml-1 font-medium">users / min</span>
        </div>
      </div>
      
      <div className="flex-1 w-full relative z-0">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
             <defs>
               <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/> {/* Amber-500 equivalent */}
                 <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                itemStyle={{ color: '#0f172a' }}
             />
             <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTraffic)" 
                animationDuration={300}
                isAnimationActive={true}
             />
           </AreaChart>
         </ResponsiveContainer>
      </div>
    </div>
  );
}
