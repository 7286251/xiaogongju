
import React, { useState } from 'react';
import { ProcessingFile, LanguageState, ToolType } from '../types';

interface ToolCardProps {
  fileData: ProcessingFile;
  langState: LanguageState;
  onCopy: (text: string) => void;
  toolType?: ToolType; 
}

const ToolCard: React.FC<ToolCardProps> = ({ fileData, langState, onCopy, toolType }) => {
  const [showMainCopyAnim, setShowMainCopyAnim] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleMainCopy = () => {
    const textToCopy = langState.isEnglish ? (fileData.result || "") : (fileData.translatedResult || "");
    onCopy(textToCopy);
    setShowMainCopyAnim(true);
    setTimeout(() => setShowMainCopyAnim(false), 2000);
  };

  const handleIndividualCopy = (text: string, id: string) => {
    onCopy(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Parsing logic for video scenes
  const renderContent = () => {
    const rawContent = langState.isEnglish ? (fileData.result || "") : (fileData.translatedResult || "");
    
    // Check if it's video reverse engineering and we have content
    if (toolType === ToolType.VIDEO_REVERSE && rawContent.includes('[SCENE_START]')) {
      const scenes = rawContent.split('[SCENE_START]').filter(s => s.trim() !== "");
      
      return (
        <div className="flex flex-col gap-5 mt-2">
          {scenes.map((scene, idx) => (
            <div 
              key={idx} 
              className="relative bg-red-950/50 border border-yellow-600/20 rounded-2xl p-6 pt-12 group/scene transition-all duration-300 hover:border-yellow-500/60 hover:bg-red-950/80 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] ring-1 ring-transparent hover:ring-yellow-500/20 overflow-hidden"
            >
              {/* Scene Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_5px_#fbbf24]"></span>
                <span className="text-[10px] font-black tracking-widest text-yellow-500/80 uppercase">分镜 {idx + 1}</span>
              </div>

              {/* Individual Copy Button - Top Right */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleIndividualCopy(scene.trim(), `scene-${idx}`);
                }}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all duration-300 flex items-center gap-1.5 ${
                  copiedId === `scene-${idx}` 
                  ? 'bg-green-600 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-red-900 hover:border-yellow-400'
                }`}
              >
                {copiedId === `scene-${idx}` ? (
                   <><span>✓</span><span>已复制</span></>
                ) : (
                   <><span>📋</span><span>复制分镜</span></>
                )}
              </button>
              
              <div className="text-yellow-100/95 leading-relaxed font-sans text-sm tracking-wide">
                {scene.trim()}
              </div>
              
              <div className="absolute -bottom-2 -right-2 opacity-[0.03] text-4xl pointer-events-none select-none group-hover/scene:opacity-[0.07] transition-opacity">🐎</div>
            </div>
          ))}
        </div>
      );
    }

    // Default rendering for Image/OCR/Translate
    return (
      <div className="relative group/text">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/10 via-yellow-500/5 to-transparent rounded-2xl blur opacity-30 group-hover/text:opacity-80 transition duration-1000"></div>
        <div className="relative bg-red-950/70 backdrop-blur-md rounded-2xl p-6 min-h-[160px] max-h-[400px] overflow-y-auto border border-yellow-500/20 text-yellow-100/90 leading-relaxed text-sm scrollbar-thin scrollbar-thumb-yellow-500/20 hover:border-yellow-500/40 transition-colors">
          {rawContent}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-red-900/40 border-2 border-yellow-600/30 rounded-[2.5rem] p-8 mb-8 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(251,191,36,0.15)] hover:border-yellow-500/60 group relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Preview Area */}
        <div className="w-full lg:w-[320px] flex-shrink-0">
          <div className="aspect-square rounded-3xl overflow-hidden border-2 border-yellow-500/20 relative shadow-2xl bg-black group-hover:border-yellow-500/50 transition-colors duration-500">
            {fileData.file.type.startsWith('image/') ? (
              <img src={fileData.preview} alt="preview" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <video src={fileData.preview} className="w-full h-full object-contain" />
            )}
            
            {fileData.status === 'processing' && (
              <>
                <div className="scan-line"></div>
                <div className="absolute inset-0 bg-yellow-500/5 pointer-events-none"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                   <div className="w-20 h-20 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(234,179,8,0.4)]"></div>
                   <span className="mt-4 text-yellow-500 font-black text-xs tracking-widest animate-pulse">正在深度分析中...</span>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[10px] text-yellow-500/40 truncate italic max-w-[200px]">
              {fileData.file.name}
            </p>
            <span className="text-[10px] text-yellow-500/40">{(fileData.file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className={`px-5 py-2 rounded-full text-xs font-black border flex items-center gap-2.5 transition-all duration-300 ${
                fileData.status === 'completed' ? 'bg-green-600/20 border-green-500/50 text-green-400' : 
                fileData.status === 'processing' ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400 animate-[pulse-glow_2s_infinite]' :
                fileData.status === 'error' ? 'bg-red-600/20 border-red-500 text-red-400' :
                'bg-gray-600/20 border-gray-700 text-gray-400'
              }`}>
                {fileData.status === 'processing' ? (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                  </span>
                ) : (
                  <span className="text-base">{fileData.status === 'completed' ? '✓' : '●'}</span>
                )}
                <span className="tracking-widest uppercase">
                  {fileData.status === 'completed' ? '处理完成' : 
                   fileData.status === 'processing' ? '核心计算中' : 
                   fileData.status === 'error' ? '处理失败' : '队列等待'}
                </span>
              </div>
            </div>
            
            {fileData.status === 'completed' && toolType !== ToolType.VIDEO_REVERSE && (
              <button 
                onClick={handleMainCopy}
                className="relative group/btn bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-900 px-8 py-2.5 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2 overflow-hidden shadow-xl hover:shadow-yellow-500/40"
              >
                <span className="relative z-10">复制解析全文</span>
                {showMainCopyAnim && (
                  <div className="absolute inset-0 bg-green-500 flex items-center justify-center z-20 animate-in fade-in zoom-in duration-300">
                    <span className="text-white text-xs font-bold tracking-widest uppercase">复制成功!</span>
                  </div>
                )}
                <div className="energy-bar-shine opacity-50"></div>
              </button>
            )}
          </div>

          {/* New Advanced Progress Bar (流光溢彩进度条) */}
          <div className="relative w-full h-8 bg-red-950/80 rounded-2xl overflow-hidden mb-8 border border-yellow-500/10 p-1.5 shadow-inner">
            <div 
              className={`h-full rounded-xl transition-all duration-1000 ease-out relative flex items-center justify-end pr-4 ${
                fileData.status === 'processing' ? 'progress-flow-bg progress-glow' : 'bg-yellow-500'
              }`}
              style={{ width: `${fileData.progress}%` }}
            >
               {fileData.status === 'processing' && (
                  <div className="energy-bar-shine"></div>
               )}
               
               {fileData.progress > 10 && (
                 <span className="text-[10px] text-red-900 font-black drop-shadow-sm z-10 flex items-center gap-1">
                   {fileData.status === 'processing' && <span className="animate-pulse">⚡</span>}
                   {Math.round(fileData.progress)}%
                 </span>
               )}
            </div>
            
            {fileData.status === 'processing' && (
               <div className="absolute inset-0 opacity-20 pointer-events-none bg-yellow-500 animate-[galloping-pulse_2s_infinite]"></div>
            )}
          </div>

          {/* Result Area */}
          <div className="flex-grow">
            {fileData.status === 'completed' ? (
              renderContent()
            ) : fileData.status === 'processing' ? (
              <div className="flex flex-col gap-4 px-2">
                 <div className="h-4 bg-yellow-500/5 rounded-full animate-pulse w-[90%]"></div>
                 <div className="h-4 bg-yellow-500/5 rounded-full animate-pulse w-[85%]"></div>
                 <div className="h-4 bg-yellow-500/5 rounded-full animate-pulse w-[95%]"></div>
                 <div className="h-4 bg-yellow-500/5 rounded-full animate-pulse w-[70%]"></div>
              </div>
            ) : fileData.status === 'error' ? (
              <div className="flex items-center gap-4 text-red-400 bg-red-950/40 p-6 rounded-3xl border border-red-500/30">
                <span className="text-3xl">⚠️</span>
                <div className="flex flex-col">
                  <span className="font-black text-xs tracking-widest uppercase mb-1">解析任务异常</span>
                  <span className="text-sm opacity-80">{fileData.error || "无法连接到处理核心，请检查网络或更换文件重试"}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-yellow-500/20 italic bg-red-950/20 rounded-3xl border border-dashed border-yellow-500/10">
                <span className="text-2xl mb-2">💤</span>
                <span className="text-xs tracking-widest uppercase font-bold">等待任务输入...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
