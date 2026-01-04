
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

const BackgroundElements: React.FC = () => {
  return (
    <>
      {/* 动态祥云 */}
      <div className="bg-cloud top-[10%]" style={{ animationDelay: '0s' }}>
        <svg width="200" height="100" viewBox="0 0 200 100" fill="currentColor" className="text-yellow-500/20">
          <path d="M50 80c-20 0-35-15-35-30s15-30 35-30c5 0 10 1 15 3 10-15 30-25 50-25s40 10 50 25c5-2 10-3 15-3 20 0 35 15 35 30s-15 30-35 30H50z" />
        </svg>
      </div>
      <div className="bg-cloud top-[40%]" style={{ animationDelay: '-20s' }}>
        <svg width="150" height="75" viewBox="0 0 200 100" fill="currentColor" className="text-yellow-500/10">
          <path d="M50 80c-20 0-35-15-35-30s15-30 35-30c5 0 10 1 15 3 10-15 30-25 50-25s40 10 50 25c5-2 10-3 15-3 20 0 35 15 35 30s-15 30-35 30H50z" />
        </svg>
      </div>
      <div className="bg-cloud top-[70%]" style={{ animationDelay: '-40s' }}>
        <svg width="250" height="125" viewBox="0 0 200 100" fill="currentColor" className="text-yellow-500/20">
          <path d="M50 80c-20 0-35-15-35-30s15-30 35-30c5 0 10 1 15 3 10-15 30-25 50-25s40 10 50 25c5-2 10-3 15-3 20 0 35 15 35 30s-15 30-35 30H50z" />
        </svg>
      </div>

      {/* 奔马掠影 */}
      <div className="bg-horse top-[30%]">🐎</div>
      <div className="bg-horse top-[60%]" style={{ animationDelay: '-7s' }}>🐎</div>
    </>
  );
};

const NewYearLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative text-white selection:bg-yellow-500 selection:text-red-900 bg-[#7b0000]">
      <Fireworks />
      <BackgroundElements />
      
      {/* 装饰性文字 - 切换为清晰系统字体 */}
      <div className="fixed top-10 left-10 opacity-10 pointer-events-none select-none">
        <h2 className="text-9xl font-black text-yellow-500">2026</h2>
      </div>
      <div className="fixed bottom-10 left-10 opacity-10 pointer-events-none select-none flex flex-col items-center">
         <span className="text-6xl font-black text-yellow-600 tracking-[0.5em] [writing-mode:vertical-rl]">万马奔腾</span>
      </div>
      
      {/* 灯笼装饰 */}
      <div className="fixed top-0 right-10 z-10 hidden md:block">
        <div className="w-1 bg-red-800 h-20 mx-auto"></div>
        <div className="w-16 h-20 bg-red-600 rounded-2xl border-2 border-yellow-500 flex items-center justify-center relative shadow-xl">
          <span className="text-yellow-400 text-3xl font-black">福</span>
          <div className="absolute -bottom-4 w-12 h-4 bg-red-700 rounded-full flex justify-between px-1">
             <div className="w-0.5 h-6 bg-yellow-600"></div>
             <div className="w-0.5 h-6 bg-yellow-600"></div>
             <div className="w-0.5 h-6 bg-yellow-600"></div>
          </div>
        </div>
      </div>

      <header className="py-16 text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-black text-yellow-400 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tighter">
          小祖宗实用工具
        </h1>
        <div className="mt-6 flex flex-col items-center">
          <div className="h-1 w-32 bg-yellow-500 mb-2 rounded-full"></div>
          <p className="text-yellow-200 tracking-[0.3em] text-xl font-bold">
            2026 丙午马年 · 智慧科技 · 大吉大利
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20 relative z-10">
        {children}
      </main>

      <footer className="text-center py-10 text-yellow-500/40 text-sm font-bold tracking-widest bg-black/10 backdrop-blur-sm">
        © 2026 小祖宗 · 愿君马到成功 · 科技赋能生活
      </footer>
    </div>
  );
};

export default NewYearLayout;
