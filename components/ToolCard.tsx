
import React, { useState } from 'react';
import { ProcessingFile, LanguageState } from '../types';

interface ToolCardProps {
  fileData: ProcessingFile;
  langState: LanguageState;
  onCopy: (text: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ fileData, langState, onCopy }) => {
  const [showCopyAnim, setShowCopyAnim] = useState(false);

  const handleCopy = () => {
    const textToCopy = langState.isEnglish ? (fileData.result || "") : (fileData.translatedResult || "");
    onCopy(textToCopy);
    setShowCopyAnim(true);
    setTimeout(() => setShowCopyAnim(false), 2000);
  };

  return (
    <div className="bg-red-900/60 border-2 border-yellow-600/40 rounded-3xl p-6 mb-6 backdrop-blur-md transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Preview Area */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="aspect-square rounded-2xl overflow-hidden border-2 border-yellow-500/30 relative shadow-inner bg-black">
            {fileData.file.type.startsWith('image/') ? (
              <img src={fileData.preview} alt="preview" className="w-full h-full object-contain" />
            ) : (
              <video src={fileData.preview} className="w-full h-full object-contain" />
            )}
            
            {fileData.status === 'processing' && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                 <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <p className="text-xs text-yellow-500/60 mt-2 truncate italic">{fileData.file.name}</p>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-bold border ${
                fileData.status === 'completed' ? 'bg-green-600/30 border-green-500 text-green-300' : 
                fileData.status === 'processing' ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300' :
                fileData.status === 'error' ? 'bg-red-600/30 border-red-500 text-red-300' :
                'bg-gray-600/30 border-gray-500 text-gray-300'
              }`}>
                {fileData.status === 'completed' ? '解析完成' : 
                 fileData.status === 'processing' ? '正在解析...' : 
                 fileData.status === 'error' ? '解析失败' : '排队中'}
              </span>
              
              {fileData.status === 'completed' && (
                <button 
                  onClick={handleCopy}
                  className="relative group bg-yellow-500 hover:bg-yellow-400 text-red-900 px-6 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 overflow-hidden"
                >
                  <span className="relative z-10">复制结果</span>
                  {showCopyAnim && (
                    <div className="absolute inset-0 bg-green-500 flex items-center justify-center z-20 animate-in fade-in zoom-in duration-300">
                      <span className="text-white text-sm">复制成功! ✓</span>
                    </div>
                  )}
                  {/* Technology effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-red-950/80 rounded-full overflow-hidden mb-6 border border-yellow-500/20">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 transition-all duration-500 progress-glow flex items-center justify-end pr-2"
                style={{ width: `${fileData.progress}%` }}
              >
                 {fileData.progress > 10 && (
                   <span className="text-[10px] text-red-900 font-bold">{Math.round(fileData.progress)}%</span>
                 )}
              </div>
            </div>

            {/* Result Text */}
            <div className="bg-red-950/50 rounded-2xl p-4 min-h-[120px] max-h-[300px] overflow-y-auto border border-yellow-500/10 text-yellow-100/90 leading-relaxed font-mono text-sm whitespace-pre-wrap">
              {fileData.status === 'completed' ? (
                langState.isEnglish ? fileData.result : fileData.translatedResult
              ) : fileData.status === 'processing' ? (
                <div className="flex flex-col gap-2">
                   <div className="h-4 bg-yellow-500/10 rounded animate-pulse w-3/4"></div>
                   <div className="h-4 bg-yellow-500/10 rounded animate-pulse w-full"></div>
                   <div className="h-4 bg-yellow-500/10 rounded animate-pulse w-2/3"></div>
                </div>
              ) : fileData.status === 'error' ? (
                <span className="text-red-400">{fileData.error || "发生了未知错误"}</span>
              ) : (
                "待解析..."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
