
import React, { useState } from 'react';
import { MascotItem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface MascotModuleProps {
  onCopy: (text: string) => void;
}

const MASCOT_DATA: MascotItem[] = [
  {
    id: 'koi',
    name: '吉祥物 · 锦鲤',
    description: '身形完整，尾鳍如扇，灵动祥瑞，通体缀满缠枝莲与宝相花纹。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：锦鲤，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，鱼眼睛炯炯有神，尾鳍舒展呈优雅扇形，兼具灵动与祥瑞神态，通体装饰奢华，缀满中国传统纹饰——鳞片以缠枝莲纹勾勒，鱼身嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微，鱼身鳞片的层次感与背景暗纹形成虚实对比，透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 显耀高照”，与锦鲤的祥瑞气质相映成趣。'
  },
  {
    id: 'kylin',
    name: '吉祥物 · 麒麟',
    description: '威严镇守，鬃毛飘逸，鳞片精巧。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：麒麟，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，麒麟目炯炯有神，神态威严祥瑞，鬃毛与尾部线条舒展飘逸，兼具灵动与镇守气韵。通体装饰奢华，缀满中国传统纹饰——鳞片以缠枝莲纹勾勒，躯体嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微，麒麟自身纹理层次与背景暗纹形成虚实对比。透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 瑞呈祥瑞”，与麒麟的祥瑞气质相映成趣。'
  },
  {
    id: 'rabbit',
    name: '吉祥物 · 瑞兔',
    description: '灵动温润，长耳优雅，寓意玉兔迎春。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：瑞兔，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，兔眼圆润炯炯有神，耳朵修长上扬呈优雅弧线，神态灵动温润，兼具灵动与祥瑞气质。通体装饰奢华，缀满中国传统纹饰——毛发与服饰纹理以缠枝莲纹勾勒，躯体嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微，瑞兔毛发层次与背景暗纹形成虚实对比，透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 玉兔迎春”，与瑞兔的祥瑞气质相映成趣。'
  },
  {
    id: 'chicken',
    name: '吉祥物 · 瑞鸡',
    description: '昂扬自信，尾羽华丽如扇，火红鸡冠。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：瑞鸡，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，鸡眼明亮炯炯有神，鸡冠高耸呈火焰般喷薄曲线，尾羽层层舒展如开扇般华丽。姿态昂扬自信、兼具灵动与祥瑞神态。通体装饰奢华，缀满中国传统纹饰——羽毛纹理以缠枝莲纹勾勒，躯体嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微，瑞鸡羽毛层次与背景暗纹形成虚实对比，透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 青屋呈瑞”，与瑞鸡的祥瑞气质相映成趣。'
  },
  {
    id: 'horse',
    name: '吉祥物 · 瑞马',
    description: '鬃毛飞扬，英姿飒爽，一马当先。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：瑞马，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，马眼明亮炯炯有神，鬃毛飘逸如流带飞扬，四蹄英姿矫健有力。整体轮廓兼具速度感与祥瑞气韵。通体装饰奢华，缀满中国传统纹饰——鬃毛与肌理线条以缠枝莲纹勾勒，躯体嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微，瑞马肌理层次与背景暗纹形成虚实对比，透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 马到成功”，与瑞马的祥瑞气质相映成趣。'
  },
  {
    id: 'dog',
    name: '吉祥物 · 瑞狗',
    description: '蹲坐守护，含如意流苏，忠诚招福。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：瑞狗，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，狗眼圆亮炯炯有神。整体姿态采用“蹲坐守护四望”的吉祥动作，身体端坐稳重，前爪并拢收敛，胸口线条饱满，头部轻轻回望形成优雅弧线轨迹。嘴里含着吉祥气。尾巴自然卷曲带有云雾状。像云山一样重更显浑厚，并轻吐一缕如意红流苏穗子，呈现守护与招福气韵。通体装饰奢华，缀满中国传统纹饰——毛发与饰纹以缠枝莲纹勾勒，身躯嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微。狗身毛发与纹饰层次与背景暗纹形成虚实对比，透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 旺运守福”，与瑞狗的祥瑞气质相映成趣。'
  },
  {
    id: 'pig',
    name: '吉祥物 · 瑞猪',
    description: '富态福气，背负锦囊，诸事圆满。',
    isGenerating: false,
    prompt: '中国风插画大师杰作，国风线稿插画，抽象画风，祝传禧风格，中国节日特色吉祥物：瑞猪，身形图案完整，美轮美奂。线条柔美灵动如流水缠绕，猪眼圆润炯炯有神。鼻头圆润饱满具福气，整体姿态为端坐静态吉祥造型，身体圆润敛合，左右对称，似有四肢，结构清晰稳定：四肢自然收拢于身体下方。背部隐约背负一个红色锦袋布袋（财袋）。布袋口紧抓软材质感呈现。袋口用金色如意流苏锦带系于流苏穗子。布袋结合背部曲线不得边界，不感性整体结构，不延展：头部微微上扬带英气，神态慈祥富态、祥和喜庆。耳朵柔软外展呈可爱弧度，尾巴卷成小巧螺旋，整体造型圆满而不臃肿。通体装饰奢华，缀满中国传统纹饰——皮肤机理与饰纹以缠枝莲纹勾勒，猪身嵌宝相花与如意纹，荧光金色线条沿轮廓游走。0.5mm 极细金色金属质感勾边凸显每一处纹路，在正红色背景上熠熠生辉。中景正构图，属国风奇幻流派，肌理线条繁复如织，纹饰细节精致入微，猪身肌理层次与背景暗纹形成虚实对比，透着国风神秘氛围。高清 8K 渲染，超高清分辨率呈现最佳品质，每一根金线的光泽、每一处纹饰的转折都清晰可辨，堪称顶级壁纸。画面上方用轻透淡金艺术字书写“2026 Chinese New Year 诸事圆满”，与瑞猪的祥瑞气质相映成趣。'
  }
];

const MascotModule: React.FC<MascotModuleProps> = ({ onCopy }) => {
  const [mascots, setMascots] = useState<MascotItem[]>(MASCOT_DATA);
  const [refiningId, setRefiningId] = useState<string | null>(null);

  const handleRefine = async (id: string) => {
    setRefiningId(id);
    const mascot = mascots.find(m => m.id === id);
    if (!mascot) return;

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你是一名顶级 AI 绘画提示词优化专家。请基于以下大师级线稿描述，进行深度润色，使其艺术感更强，更符合 Midjourney v6 或 Stable Diffusion 3 的顶级渲染标准。保持原有的“祝传禧”抽象风格和中国红背景色调，输出一段更极致的中文提示词：\n\n${mascot.prompt}`
      });

      const newPrompt = response.text || mascot.prompt;
      setMascots(prev => prev.map(m => m.id === id ? { ...m, prompt: newPrompt } : m));
    } catch (err) {
      console.error("优化失败", err);
    } finally {
      setRefiningId(null);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-red-900/40 p-12 rounded-[3.5rem] border-2 border-yellow-600/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden group mb-12 text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent progress-flow-bg"></div>
        <h2 className="text-4xl md:text-6xl font-festive text-yellow-500 mb-6 drop-shadow-lg">2026 瑞兽呈祥 · 大师级提示词生成</h2>
        <p className="max-w-3xl mx-auto text-yellow-200/80 leading-relaxed text-lg font-light">
          融合“祝传禧”抽象线稿风格，每一个字符都承载着千年的祥瑞底蕴。
          选择心仪吉祥物，由超级 AI 为您生成可 1:1 还原顶级画质的生成提示词。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mascots.map(m => (
          <div 
            key={m.id} 
            className="bg-red-950/40 border-2 border-yellow-600/20 rounded-[3rem] overflow-hidden group hover:border-yellow-500/60 transition-all duration-500 hover:-translate-y-3 flex flex-col shadow-2xl relative"
          >
            {/* 饰纹背景 */}
            <div className="absolute top-4 right-4 text-4xl opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">🐎</div>
            
            <div className="p-10 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-3xl font-festive text-yellow-500 tracking-wider">{m.name}</h3>
                 <span className="text-[10px] bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/30 text-yellow-500 font-black tracking-widest">PROMPT V1.0</span>
              </div>
              
              <div className="bg-red-950/60 rounded-2xl p-6 border border-yellow-500/10 min-h-[220px] max-h-[300px] overflow-y-auto mb-8 scrollbar-thin scrollbar-thumb-yellow-500/20">
                <p className="text-sm text-yellow-100/90 leading-relaxed font-mono tracking-wide">
                  {m.prompt}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => onCopy(m.prompt)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-900 font-black text-sm tracking-[0.2em] uppercase shadow-lg shadow-yellow-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span>📋</span>
                  <span>一键复制大师提示词</span>
                </button>
                <button 
                  onClick={() => handleRefine(m.id)}
                  disabled={refiningId === m.id}
                  className={`w-full py-3.5 rounded-2xl border-2 border-yellow-500/30 text-yellow-500 font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:bg-yellow-500/10 ${refiningId === m.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {refiningId === m.id ? (
                    <><span className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></span>正在深度润色...</>
                  ) : (
                    <><span>✨</span>AI 顶级艺术优化</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MascotModule;
