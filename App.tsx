
import React, { useState, useRef, useEffect } from 'react';
import { ToolType, ProcessingFile, LanguageState } from './types';
import NewYearLayout from './components/NewYearLayout';
import ToolCard from './components/ToolCard';
import MascotModule from './components/MascotModule';
import PromptMaster from './components/PromptMaster';
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
        }, { customStyle, targetDuration: activeTab === ToolType.VIDEO_REVERSE ? targetDuration : undefined });
        setFiles(prev => prev.map(item => item.id === f.id ? { ...item, status: 'completed', progress: 100, result: result.original, translatedResult: result.translated } : item));
      } catch (err: any) {
        setFiles(prev => prev.map(item => item.id === f.id ? { ...item, status: 'error', error: err.message || "解析异常" } : item));
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    // Fix: Explicitly type 'file' as File and use 'as const' for status to resolve type mismatch errors
    const newFiles: ProcessingFile[] = Array.from(selectedFiles).map((file: File, i: number) => ({
      id: `${Date.now()}-${i}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
      progress: 0
    }));
    setFiles(prev => [...newFiles, ...prev]);
    triggerProcessing(newFiles);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("已复制到剪贴板！");
  };

  const tabs = [
    { id: ToolType.IMAGE_REVERSE, label: "图片反推", icon: "🖼️" },
    { id: ToolType.VIDEO_REVERSE, label: "视频分镜", icon: "🎬" },
    { id: ToolType.PROMPT_MASTER, label: "灵猫意境", icon: "🪄" },
    { id: ToolType.MASCOT_GEN, label: "新春提示词", icon: "🧧" },
    { id: ToolType.OCR, label: "文字提取", icon: "📄" },
    { id: ToolType.TRANSLATE, label: "图片翻译", icon: "🌐" }
  ];

  return (
    <NewYearLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center gap-4 mb-10">
          <button onClick={() => window.location.href = "mqqwpa://im/chat?chat_type=wpa&uin=307779523"} className="bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white px-6 py-2.5 rounded-2xl transition-all font-bold">QQ: 307779523</button>
          <button onClick={() => copyToClipboard("XiaoYu_R1999")} className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white px-6 py-2.5 rounded-2xl transition-all font-bold">微信: XiaoYu_R1999</button>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setFiles([]); }}
              className={`px-6 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all border-2 ${activeTab === tab.id ? 'bg-yellow-500 text-red-900 border-yellow-300' : 'bg-red-800/40 text-yellow-500/80 border-yellow-700/30'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === ToolType.PROMPT_MASTER ? (
          <PromptMaster onCopy={copyToClipboard} />
        ) : activeTab === ToolType.MASCOT_GEN ? (
          <MascotModule onCopy={copyToClipboard} />
        ) : (
          <>
            <div className="bg-red-900/40 p-8 rounded-[2.5rem] border border-yellow-600/30 shadow-2xl backdrop-blur-md mb-8">
              <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-900 py-5 rounded-2xl font-black text-xl">
                上传{activeTab === ToolType.VIDEO_REVERSE ? '视频' : '图片'}开始解析
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept={activeTab === ToolType.VIDEO_REVERSE ? "video/*" : "image/*"} />
            </div>
            <div className="space-y-6">
              {files.map(f => <ToolCard key={f.id} fileData={f} langState={langState} onCopy={copyToClipboard} toolType={activeTab} />)}
            </div>
          </>
        )}
      </div>
    </NewYearLayout>
  );
};

export default App;
