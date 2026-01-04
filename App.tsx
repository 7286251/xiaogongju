
import React, { useState, useRef, useEffect } from 'react';
import { ToolType, ProcessingFile, LanguageState } from './types';
import NewYearLayout from './components/NewYearLayout';
import ToolCard from './components/ToolCard';
import MascotModule from './components/MascotModule';
import { processMedia } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.IMAGE_REVERSE);
  const [files, setFiles] = useState<ProcessingFile[]>([]);
  const [langState, setLangState] = useState<LanguageState>({ isEnglish: false });
  const [customStyle, setCustomStyle] = useState("");
  const [targetDuration, setTargetDuration] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerProcessing = async (targetFiles: ProcessingFile[]) => {
    targetFiles.forEach(async (f) => {
      try {
        setFiles(prev => prev.map(item => item.id === f.id ? { ...item, status: 'processing', progress: 10 } : item));
        
        const result = await processMedia(f.file, activeTab, (p) => {
          setFiles(prev => prev.map(item => item.id === f.id ? { ...item, progress: p } : item));
        }, {
          customStyle,
          targetDuration: activeTab === ToolType.VIDEO_REVERSE ? targetDuration : undefined
        });

        setFiles(prev => prev.map(item => item.id === f.id ? { 
          ...item, 
          status: 'completed', 
          progress: 100, 
          result: result.original, 
          translatedResult: result.translated 
        } : item));
      } catch (err: any) {
        setFiles(prev => prev.map(item => item.id === f.id ? { 
          ...item, 
          status: 'error', 
          error: err.message || "解析任务异常，请重试" 
        } : item));
      }
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newProcessingFiles: ProcessingFile[] = Array.from(selectedFiles).map((file: File, index: number) => ({
      id: `${Date.now()}-${index}`,
      file: file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0,
      customStyle,
      targetDuration
    }));

    setFiles(prev => [...newProcessingFiles, ...prev]);
    triggerProcessing(newProcessingFiles);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleContactJump = (type: 'QQ' | 'WX') => {
    const info = type === 'QQ' ? '307779523' : 'XiaoYu_R1999';
    copyToClipboard(info);
    
    if (type === 'QQ') {
      window.location.href = `mqqwpa://im/chat?chat_type=wpa&uin=${info}&version=1&src_type=web&web_src=oicqzone.com`;
    } else {
      alert(`微信号已复制: ${info}\n即将尝试打开微信...`);
      window.location.href = 'weixin://';
    }
  };

  const tabs = [
    { id: ToolType.IMAGE_REVERSE, label: "图片反推", icon: "🖼️" },
    { id: ToolType.VIDEO_REVERSE, label: "视频分镜", icon: "🎬" },
    { id: ToolType.MASCOT_GEN, label: "新春提示词", icon: "🧧" },
    { id: ToolType.OCR, label: "文字提取", icon: "📄" },
    { id: ToolType.TRANSLATE, label: "图片翻译", icon: "🌐" }
  ];

  return (
    <NewYearLayout>
      <div className="max-w-6xl mx-auto">
        {/* 顶部联系方式 */}
        <div className="flex justify-center gap-4 mb-10 animate-in fade-in slide-in-from-top-2 duration-700">
           <button 
             onClick={() => handleContactJump('QQ')}
             className="bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/30 px-8 py-3 rounded-2xl transition-all flex items-center gap-3 group shadow-lg"
           >
             <span className="text-2xl">🐧</span>
             <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase opacity-60">联系 QQ</span>
                <span className="text-sm font-bold">307779523</span>
             </div>
             <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/20 px-2 py-1 rounded">点击跳转</span>
           </button>
           <button 
             onClick={() => handleContactJump('WX')}
             className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/30 px-8 py-3 rounded-2xl transition-all flex items-center gap-3 group shadow-lg"
           >
             <span className="text-2xl">💬</span>
             <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase opacity-60">联系微信</span>
                <span className="text-sm font-bold">XiaoYu_R1999</span>
             </div>
             <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/20 px-2 py-1 rounded">自动复制</span>
           </button>
        </div>

        {/* 导航标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setFiles([]);
              }}
              className={`px-6 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all border-2 relative overflow-hidden group ${
                activeTab === tab.id 
                ? 'bg-yellow-500 text-red-900 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.4)] scale-105' 
                : 'bg-red-800/40 text-yellow-500/80 border-yellow-700/30 hover:bg-red-800/60'
              }`}
            >
              <span className="relative z-10 text-xl">{tab.icon}</span>
              <span className="relative z-10 tracking-[0.2em]">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        {activeTab === ToolType.MASCOT_GEN ? (
          <MascotModule onCopy={copyToClipboard} />
        ) : (
          <>
            {/* 高级配置区域 */}
            {(activeTab === ToolType.IMAGE_REVERSE || activeTab === ToolType.VIDEO_REVERSE) && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {activeTab === ToolType.IMAGE_REVERSE && (
                  <div className="bg-red-950/40 p-5 rounded-3xl border border-yellow-600/20 shadow-lg col-span-full">
                    <label className="block text-yellow-500 text-sm font-bold mb-3 flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <span>自定义主题/风格注入 (1:1 像素级复刻)</span>
                      <span className="text-[10px] bg-yellow-500/20 px-2 py-0.5 rounded border border-yellow-500/40 animate-pulse">实时同步</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={customStyle}
                        onChange={(e) => setCustomStyle(e.target.value)}
                        placeholder="输入任意主题，如：赛博朋克、唯美古风、极简主义..."
                        className="flex-grow bg-red-900/40 border border-yellow-600/30 rounded-2xl px-5 py-3 text-yellow-100 placeholder:text-yellow-600/40 focus:outline-none focus:border-yellow-500 transition-colors shadow-inner"
                      />
                      {files.length > 0 && (
                        <button 
                          onClick={() => triggerProcessing(files)}
                          className="bg-yellow-500 text-red-900 px-8 py-3 rounded-2xl font-black hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] whitespace-nowrap"
                        >
                          刷新解析
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === ToolType.VIDEO_REVERSE && (
                  <div className="bg-red-950/40 p-5 rounded-3xl border border-yellow-600/20 shadow-lg col-span-full">
                    <label className="block text-yellow-500 text-sm font-bold mb-3 flex items-center gap-2">
                      <span className="text-lg">⏳</span>
                      <span>视频总时长补全 (例如: 15秒)</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={targetDuration}
                        onChange={(e) => setTargetDuration(e.target.value)}
                        placeholder="输入目标总时长，不足部分将自动基于逻辑补全分镜内容..."
                        className="flex-grow bg-red-900/40 border border-yellow-600/30 rounded-2xl px-5 py-3 text-yellow-100 placeholder:text-yellow-600/40 focus:outline-none focus:border-yellow-500 transition-colors shadow-inner"
                      />
                      {files.length > 0 && (
                        <button 
                          onClick={() => triggerProcessing(files)}
                          className="bg-yellow-500 text-red-900 px-8 py-3 rounded-2xl font-black hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)] whitespace-nowrap"
                        >
                          同步补全
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 全局上传控制 */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-red-900/40 p-8 rounded-[2.5rem] border border-yellow-600/30 shadow-2xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent progress-flow-bg"></div>
              
              <div className="flex items-center gap-6 z-10">
                <label className="flex items-center cursor-pointer select-none">
                  <span className="mr-4 text-yellow-500 font-black drop-shadow-md tracking-widest">中 / 英 模式</span>
                  <div 
                    className="relative w-16 h-8 bg-red-950 rounded-full p-1 border border-yellow-600/50 shadow-inner"
                    onClick={() => setLangState(prev => ({ isEnglish: !prev.isEnglish }))}
                  >
                    <div className={`w-6 h-6 bg-yellow-500 rounded-full transition-all duration-300 shadow-[0_0_15px_#f59e0b] ${langState.isEnglish ? 'translate-x-8' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="ml-4 text-sm font-bold text-yellow-200/80">{langState.isEnglish ? 'English' : '中文解析'}</span>
                </label>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full md:w-auto bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-900 px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:shadow-yellow-500/60 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 relative overflow-hidden group"
              >
                <span className="text-3xl z-10">📤</span>
                <span className="z-10 tracking-widest">上传{activeTab === ToolType.VIDEO_REVERSE ? '视频' : '图片'}开始解析</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] group-hover:animate-[shimmer_1s_infinite]"></div>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple 
                accept={activeTab === ToolType.VIDEO_REVERSE ? "video/*" : "image/*"}
              />
            </div>

            {/* 结果列表 */}
            <div className="space-y-6">
              {files.length === 0 ? (
                <div className="text-center py-32 bg-red-900/20 rounded-[3rem] border-2 border-dashed border-yellow-600/20 relative group overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   <div className="text-8xl mb-8 animate-bounce">🐎</div>
                   <p className="text-yellow-500/80 text-3xl font-festive drop-shadow-lg">
                     {activeTab === ToolType.IMAGE_REVERSE ? '上传原图，解析大师将为您 1:1 深度复刻' : '请上传媒体文件，由超级 AI 为您处理'}
                   </p>
                   <p className="text-yellow-600/40 mt-6 text-sm italic tracking-[0.4em] font-light">
                     <span className="mx-3">⚡</span>
                     2026 马到成功 · 智慧新春 · 科技赋能
                     <span className="mx-3">⚡</span>
                   </p>
                </div>
              ) : (
                files.map(fileItem => (
                  <ToolCard 
                    key={fileItem.id} 
                    fileData={fileItem} 
                    langState={langState} 
                    onCopy={copyToClipboard}
                    toolType={activeTab}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </NewYearLayout>
  );
};

export default App;
