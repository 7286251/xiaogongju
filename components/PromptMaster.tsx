
import React, { useState } from 'react';
import { CatStyle } from '../types';
import { generateCreativePrompts } from '../services/geminiService';

const CAT_STYLES: CatStyle[] = [
  { id: 1, title: "中国风旗袍", description: "朱砂红绸缎，金线牡丹，中式庭院", fullPrompt: "一只漂亮的拟人化白猫...身着一袭中国风改良旗袍..." },
  { id: 2, title: "维多利亚宫廷", description: "象牙白宫廷裙，蕾丝花边，欧式古堡", fullPrompt: "拟人化白猫蓝眼睛...身穿维多利亚风格宫廷裙..." },
  { id: 3, title: "日式和服", description: "靛蓝色底，金色仙鹤，樱花庭院", fullPrompt: "拥有迷人蓝眼睛...身着日式和服...铺满樱花花瓣的日式庭院" },
  { id: 4, title: "赛博朋克", description: "科技战衣，发光纹路，霓虹街道", fullPrompt: "漂亮的拟人化白猫...穿着未来感科技战衣...充满霓虹灯光的赛博朋克城市" },
  { id: 5, title: "波西米亚", description: "亚麻长裙，彩色流苏，沙漠帐篷", fullPrompt: "拟人化白猫蓝眼睛...身着波西米亚风格长裙...沙漠中的游牧帐篷" },
  { id: 6, title: "复古美式", description: "卡其色背带裤，牛仔帽，旧木箱仓库", fullPrompt: "有着迷人蓝眼睛...身穿复古美式工装...堆满旧木箱的仓库" },
  { id: 7, title: "中世纪骑士", description: "银灰色铠甲，红色皮革，战场营地", fullPrompt: "漂亮的拟人化白猫...身着中世纪骑士铠甲...燃烧着篝火的中世纪战场营地" },
  { id: 8, title: "夏威夷沙滩", description: "碎花吊带裙，椰子树，明媚海滩", fullPrompt: "拟人化白猫蓝眼睛...穿着夏威夷风格沙滩装...蔚蓝大海边生长着高大的椰子树" },
  { id: 9, title: "洛丽塔花园", description: "淡紫色蓬蓬裙，下午茶，蔷薇花园", fullPrompt: "拥有迷人蓝眼睛...身着洛丽塔风格连衣裙...摆满甜点和茶具的欧式下午茶花园" },
  { id: 10, title: "敦煌飞天", description: "橘红色长裙，金色云纹，莫高窟壁画", fullPrompt: "漂亮的拟人化白猫...身着敦煌飞天服饰...敦煌莫高窟壁画风格的场景" },
  { id: 11, title: "苏格兰格子", description: "红黑格子裙，针织背心，高地草地", fullPrompt: "拟人化白猫蓝眼睛...穿着苏格兰格子裙...苏格兰高地的草地" },
  { id: 12, title: "哥特古堡", description: "黑色皮质裙，银色链条，阴森大厅", fullPrompt: "有着迷人蓝眼睛...身着哥特风格服饰...阴森的古堡大厅" },
  { id: 13, title: "西双版纳", description: "淡青色筒裙，孔雀羽毛，热带雨林", fullPrompt: "漂亮的拟人化白猫...穿着傣族风格服饰...西双版纳的热带雨林" },
  { id: 14, title: "古希腊神庙", description: "纯白亚麻长袍，月桂花环，遗址大理石", fullPrompt: "拟人化白猫蓝眼睛...身着古希腊风格长袍...古希腊神庙遗址" },
  { id: 15, title: "印第安草原", description: "鹿皮连衣裙，羽毛头饰，大草原", fullPrompt: "有着迷人蓝眼睛...穿着印第安风格服饰...北美大草原" },
  { id: 16, title: "现代艺术", description: "米白色西装，尖头高跟鞋，画廊", fullPrompt: "漂亮的拟人化白猫...身着现代极简风套装...现代艺术画廊" },
  { id: 17, title: "蒸汽朋克", description: "皮质马甲，机械手杖，蒸汽工厂", fullPrompt: "拟人化白猫蓝眼睛...穿着蒸汽朋克风格服装...充满蒸汽管道和齿轮装置的工厂" },
  { id: 18, title: "江南汉服", description: "淡粉色襦裙，荷花池，青砖黛瓦", fullPrompt: "有着迷人蓝眼睛...身着中国汉服...江南水乡的庭院" },
  { id: 19, title: "太空星云", description: "银白宇航服，宇宙花，星空", fullPrompt: "漂亮的拟人化白猫...穿着太空宇航员服饰...浩瀚的宇宙星空" },
  { id: 20, title: "波普都市", description: "鲜艳唇印裙，霓虹灯，都市街头", fullPrompt: "拟人化白猫蓝眼睛...身着波普艺术风格服装...充满霓虹灯和广告牌的都市街头" }
];

const PromptMaster: React.FC<{ onCopy: (s: string) => void }> = ({ onCopy }) => {
  const [selectedId, setSelectedId] = useState(1);
  const [customInput, setCustomInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ image: string; video: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const style = CAT_STYLES.find(s => s.id === selectedId);
      const res = await generateCreativePrompts(style?.fullPrompt || "", customInput);
      setResults(res);
    } catch (err) {
      alert("生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in zoom-in-95 duration-700">
      {/* 左侧：风格选择器 */}
      <div className="w-full lg:w-1/3 bg-red-900/30 p-6 rounded-[2.5rem] border border-yellow-500/20 backdrop-blur-xl">
        <h3 className="text-xl font-black text-yellow-500 mb-6 flex items-center gap-2">
          <span>🎨</span> 核心风格基底 (20款)
        </h3>
        <div className="space-y-3 h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500/30">
          {CAT_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedId(style.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all border ${
                selectedId === style.id 
                ? 'bg-yellow-500 text-red-900 border-yellow-300 shadow-lg scale-[1.02]' 
                : 'bg-red-950/40 text-yellow-500/60 border-yellow-500/10 hover:bg-red-800/40 hover:text-yellow-500'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black">风格 {style.id}: {style.title}</span>
                {selectedId === style.id && <span className="text-xs">已选</span>}
              </div>
              <p className="text-xs opacity-80 leading-tight">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧：生成与结果 */}
      <div className="flex-grow space-y-8">
        {/* 输入框 */}
        <div className="bg-red-950/40 p-8 rounded-[3rem] border border-yellow-500/20 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/20 group-hover:bg-yellow-500 transition-colors"></div>
          <h3 className="text-xl font-black text-yellow-500 mb-4 flex items-center gap-2">
            <span>💡</span> 赋予灵猫新创意
          </h3>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="例如：灵猫正在云端吃年夜饭、正在舞龙灯、在赛博街道极速飞驰..."
            className="w-full h-32 bg-red-900/30 border border-yellow-500/20 rounded-2xl p-5 text-yellow-100 placeholder:text-yellow-600/30 focus:outline-none focus:border-yellow-500 transition-all font-bold"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full mt-6 py-5 rounded-2xl font-black text-lg tracking-[0.3em] transition-all relative overflow-hidden ${
              isGenerating ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-red-900 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] active:scale-95'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-4 border-red-900 border-t-transparent rounded-full animate-spin"></span>
                意境融合中...
              </span>
            ) : "开始意境融合生成提示词"}
            {!isGenerating && <div className="energy-bar-shine opacity-30"></div>}
          </button>
        </div>

        {/* 结果显示 */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-700">
            {/* 图像提示词 */}
            <div className="bg-red-900/40 p-8 rounded-[3rem] border-2 border-yellow-500/30 relative">
              <div className="absolute -top-4 left-8 bg-yellow-500 text-red-900 px-4 py-1 rounded-full font-black text-xs">MJ / SD 图像专家</div>
              <div className="h-[250px] overflow-y-auto text-yellow-100/90 font-bold text-sm leading-relaxed mb-6 scrollbar-thin scrollbar-thumb-yellow-500/20">
                {results.image}
              </div>
              <button 
                onClick={() => onCopy(results.image)}
                className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500 hover:text-red-900 text-yellow-500 border border-yellow-500/30 rounded-xl font-black transition-all"
              >
                复制图像提示词
              </button>
            </div>

            {/* 视频提示词 */}
            <div className="bg-red-900/40 p-8 rounded-[3rem] border-2 border-yellow-500/30 relative">
              <div className="absolute -top-4 left-8 bg-yellow-500 text-red-900 px-4 py-1 rounded-full font-black text-xs">Sora / Veo 视频大师</div>
              <div className="h-[250px] overflow-y-auto text-yellow-100/90 font-bold text-sm leading-relaxed mb-6 scrollbar-thin scrollbar-thumb-yellow-500/20">
                {results.video}
              </div>
              <button 
                onClick={() => onCopy(results.video)}
                className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500 hover:text-red-900 text-yellow-500 border border-yellow-500/30 rounded-xl font-black transition-all"
              >
                复制视频提示词
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptMaster;
