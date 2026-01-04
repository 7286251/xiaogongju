
import React, { useState, useCallback, useRef } from 'react';
import { ToolType, ProcessingFile, LanguageState } from './types';
import NewYearLayout from './components/NewYearLayout';
import ToolCard from './components/ToolCard';
import { processMedia } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.IMAGE_REVERSE);
  const [files, setFiles] = useState<ProcessingFile[]>([]);
  const [langState, setLangState] = useState<LanguageState>({ isEnglish: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Explicitly typing the map parameters to fix inference errors on line 18 and 21
    const newProcessingFiles: ProcessingFile[] = Array.from(selectedFiles).map((file: File, index: number) => ({
      id: `${Date.now()}-${index}`,
      file: file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0
    }));

    setFiles(prev => [...newProcessingFiles, ...prev]);

    // Process sequentially or in parallel? Let's do parallel for speed.
    newProcessingFiles.forEach(async (f) => {
      try {
        setFiles(prev => prev.map(item => item.id === f.id ? { ...item, status: 'processing', progress: 10 } : item));
        
        const result = await processMedia(f.file, activeTab, (p) => {
          setFiles(prev => prev.map(item => item.id === f.id ? { ...item, progress: p } : item));
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
          error: err.message || "接口调用异常" 
        } : item));
      }
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    { id: ToolType.IMAGE_REVERSE, label: "图片反推提示词", icon: "🖼️" },
    { id: ToolType.VIDEO_REVERSE, label: "视频反推提示词", icon: "🎬" },
    { id: ToolType.OCR, label: "精准文字提取", icon: "📄" },
    { id: ToolType.TRANSLATE, label: "智能图片翻译", icon: "🌐" }
  ];

  return (
    <NewYearLayout>
      <div className="max-w-5xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setFiles([]); // Optional: clear list when switching tools
              }}
              className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all border-2 ${
                activeTab === tab.id 
                ? 'bg-yellow-500 text-red-900 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105' 
                : 'bg-red-800/40 text-yellow-500/80 border-yellow-700/30 hover:bg-red-800/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-red-900/40 p-6 rounded-3xl border border-yellow-600/20 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <label className="flex items-center cursor-pointer select-none">
              <span className="mr-3 text-yellow-500 font-bold">中/英 切换</span>
              <div 
                className="relative w-14 h-7 bg-red-950 rounded-full p-1 border border-yellow-600/50"
                onClick={() => setLangState(prev => ({ isEnglish: !prev.isEnglish }))}
              >
                <div className={`w-5 h-5 bg-yellow-500 rounded-full transition-all duration-300 ${langState.isEnglish ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </div>
              <span className="ml-3 text-sm opacity-80">{langState.isEnglish ? 'English Mode' : '中文模式'}</span>
            </label>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full md:w-auto bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-900 px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-yellow-500/40 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
          >
            <span className="text-2xl">📤</span>
            点击上传{activeTab === ToolType.VIDEO_REVERSE ? '视频' : '图片'}
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

        {/* List of results */}
        <div className="space-y-6">
          {files.length === 0 ? (
            <div className="text-center py-20 bg-red-900/20 rounded-3xl border-2 border-dashed border-yellow-600/30">
               <div className="text-6xl mb-6 animate-bounce">🐎</div>
               <p className="text-yellow-500/60 text-xl font-festive">请上传文件以开始 AI 解析...</p>
               <p className="text-yellow-600/40 mt-2 text-sm italic">2026 马到成功 · 科技赋能生活</p>
            </div>
          ) : (
            files.map(fileItem => (
              <ToolCard 
                key={fileItem.id} 
                fileData={fileItem} 
                langState={langState} 
                onCopy={copyToClipboard}
              />
            ))
          )}
        </div>
      </div>
    </NewYearLayout>
  );
};

export default App;
