
import React, { useEffect, useState } from 'react';

const Fireworks: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; delay: string; color: string }[]>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF4500', '#FF6347', '#FFFFFF', '#FF69B4'];
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="firework"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animation: `fireworks 4s infinite ease-out ${p.delay}`,
            boxShadow: `0 0 10px ${p.color}`
          }}
        />
      ))}
    </div>
  );
};

const NewYearLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative text-white selection:bg-yellow-500 selection:text-red-900">
      <Fireworks />
      
      {/* Background Decor */}
      <div className="fixed top-10 left-10 opacity-20 pointer-events-none select-none">
        <h2 className="text-8xl font-festive text-yellow-500">2026</h2>
      </div>
      <div className="fixed bottom-10 left-10 opacity-10 pointer-events-none select-none flex flex-col items-center">
         <span className="text-6xl font-festive text-yellow-600">万马奔腾</span>
      </div>
      
      {/* Red Lantern Decoration */}
      <div className="fixed top-0 right-10 z-10 hidden md:block">
        <div className="w-1 bg-red-800 h-20 mx-auto"></div>
        <div className="w-16 h-20 bg-red-600 rounded-2xl border-2 border-yellow-500 flex items-center justify-center relative shadow-xl">
          <span className="text-yellow-400 font-festive text-2xl font-bold">福</span>
          <div className="absolute -bottom-4 w-12 h-4 bg-red-700 rounded-full flex justify-between px-1">
             <div className="w-0.5 h-6 bg-yellow-600"></div>
             <div className="w-0.5 h-6 bg-yellow-600"></div>
             <div className="w-0.5 h-6 bg-yellow-600"></div>
          </div>
        </div>
      </div>

      <header className="py-12 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-festive text-yellow-400 drop-shadow-2xl animate-pulse">
          小祖宗实用小工具
        </h1>
        <p className="mt-4 text-yellow-200 tracking-widest text-lg font-light">
          2026 丙午马年 · 大吉大利 · AI赋能
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20 relative z-10">
        {children}
      </main>

      <footer className="text-center py-8 text-red-300 text-sm opacity-60">
        © 2026 小祖宗 · 愿君如马之健，意之所向，无往不克
      </footer>
    </div>
  );
};

export default NewYearLayout;
