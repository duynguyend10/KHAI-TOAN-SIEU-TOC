import React from 'react';
import { HouseConfig, FoundationType, RoofType, PackageType, ConstructionType } from '../types';
import { UNIT_PRICES, COEFFICIENTS } from '../constants';
import { 
    Info, Settings2, DollarSign, Layers, Home, Building2, Landmark, 
    BrickWall, Coins, Gem, Crown, 
    Square, ArrowDownFromLine, Grid3x3, StretchHorizontal,
    Triangle, Component, Waves, HelpCircle
} from 'lucide-react';

interface InputFormProps {
  config: HouseConfig;
  onChange: (newConfig: HouseConfig) => void;
}

const PACKAGE_INFO = {
    [PackageType.ROUGH]: "Bao gồm toàn bộ vật tư thô (Sắt, thép, xi măng, cát, đá...) và nhân công hoàn thiện trọn gói.",
    [PackageType.FULL_ONE_STORY]: "Gói tiết kiệm chuyên dụng cho nhà cấp 4. Vật tư hoàn thiện ở mức cơ bản, tối ưu chi phí.",
    [PackageType.FULL_AVERAGE]: "Sử dụng vật tư hoàn thiện phổ thông. Phù hợp cho nhà phố, nhà cho thuê hoặc ngân sách vừa phải.",
    [PackageType.FULL_GOOD]: "Vật tư hoàn thiện thương hiệu uy tín (Viglacera, Toto, Cadivi...). Mức độ thẩm mỹ và độ bền khá tốt.",
    [PackageType.FULL_PREMIUM]: "Vật tư cao cấp, thiết bị vệ sinh/chiếu sáng nhập khẩu hoặc dòng cao cấp nhất trong nước. Tiêu chuẩn biệt thự."
};

const InputForm: React.FC<InputFormProps> = ({ config, onChange }) => {
  
  const handleChange = (field: keyof HouseConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleConstructionTypeChange = (type: ConstructionType) => {
    const newConfig = { ...config, constructionType: type };
    if (type === ConstructionType.ONE_STORY) {
        newConfig.floors = 1;
        newConfig.packageType = PackageType.FULL_ONE_STORY;
    }
    if (type === ConstructionType.VILLA) {
        newConfig.customPrice = 10000000;
    }
    onChange(newConfig);
  };

  const handleFoundationChange = (type: FoundationType) => {
    onChange({
      ...config,
      foundationType: type,
      foundationCoefficient: COEFFICIENTS.FOUNDATION[type]
    });
  };

  const handleRoofChange = (type: RoofType) => {
    onChange({
      ...config,
      roofType: type,
      roofCoefficient: COEFFICIENTS.ROOF[type]
    });
  };

  const getIconForConstruction = (type: ConstructionType) => {
      switch(type) {
          case ConstructionType.ONE_STORY: return <Home className="w-5 h-5 mb-1" />;
          case ConstructionType.TOWNHOUSE: return <Building2 className="w-5 h-5 mb-1" />;
          case ConstructionType.VILLA: return <Landmark className="w-5 h-5 mb-1" />;
      }
  };

  const getIconForPackage = (type: PackageType) => {
      switch(type) {
          case PackageType.ROUGH: return <BrickWall className="w-5 h-5 text-orange-500" />;
          case PackageType.FULL_ONE_STORY: return <Home className="w-5 h-5 text-cyan-500" />;
          case PackageType.FULL_AVERAGE: return <Coins className="w-5 h-5 text-emerald-500" />;
          case PackageType.FULL_GOOD: return <Gem className="w-5 h-5 text-purple-500" />;
          case PackageType.FULL_PREMIUM: return <Crown className="w-5 h-5 text-yellow-500" />;
      }
  };

  const getIconForFoundation = (type: FoundationType) => {
      switch(type) {
          case FoundationType.SINGLE: return <Square className="w-4 h-4" />;
          case FoundationType.PILE: return <ArrowDownFromLine className="w-4 h-4" />;
          case FoundationType.ICE: return <StretchHorizontal className="w-4 h-4" />;
          case FoundationType.RAFT: return <Grid3x3 className="w-4 h-4" />;
      }
  };

  const getIconForRoof = (type: RoofType) => {
      switch(type) {
          case RoofType.CONCRETE: return <Layers className="w-4 h-4" />;
          case RoofType.TILE_TRUSS: return <Triangle className="w-4 h-4" />;
          case RoofType.TILE_CONCRETE: return <Component className="w-4 h-4" />;
          case RoofType.CORRUGATED_IRON: return <Waves className="w-4 h-4" />;
      }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 space-y-8 border border-slate-700/50">
      
      {/* Construction Type Selection */}
      <div className="space-y-3">
         <label className="block text-xs font-bold text-cyan-500 uppercase tracking-widest">
            Loại Công Trình
         </label>
         <div className="grid grid-cols-3 gap-3">
            {Object.values(ConstructionType).map((type) => (
                <button
                    key={type}
                    onClick={() => handleConstructionTypeChange(type)}
                    className={`
                        flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 group
                        ${config.constructionType === type 
                            ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                            : 'border-slate-700 bg-slate-800/50 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                        }
                    `}
                >
                    {getIconForConstruction(type)}
                    <span className="text-xs font-semibold text-center">{type}</span>
                </button>
            ))}
         </div>
      </div>

      <div className="w-full h-px bg-slate-800" />

      {/* Dimensions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-lg border-b border-slate-800 pb-2">
            <Settings2 className="w-5 h-5 text-cyan-500" />
            <h2>Kích thước</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">Chiều rộng (m)</label>
            <input
              type="number"
              min={1}
              value={config.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 rounded-lg border border-slate-700 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none placeholder-slate-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">Chiều dài (m)</label>
            <input
              type="number"
              min={1}
              value={config.length}
              onChange={(e) => handleChange('length', Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-950 rounded-lg border border-slate-700 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none placeholder-slate-600"
            />
          </div>
        </div>

        <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-lg text-cyan-400 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Diện tích đất: <strong className="text-white">{(config.width * config.length).toFixed(1)} m²</strong></span>
        </div>
      </div>

      {/* Structural Details */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-lg border-b border-slate-800 pb-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <h2>Quy mô & Kết cấu</h2>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase">Số tầng</label>
            <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={config.floors}
                    onChange={(e) => handleChange('floors', Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="font-bold text-white w-8 text-center bg-slate-700 py-1 rounded">{config.floors}</span>
            </div>
        </div>

        {/* Móng & Mái */}
        <div className="space-y-5">
            
            {/* Foundation Section */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-slate-400 uppercase">Loại móng</label>
                    <div className="flex items-center gap-2 text-xs">
                         <span className="text-slate-500">Hệ số:</span>
                         <div className="relative w-16">
                            <input
                                type="number"
                                min={0}
                                max={200}
                                value={Math.round(config.foundationCoefficient * 100)}
                                onChange={(e) => handleChange('foundationCoefficient', Number(e.target.value) / 100)}
                                className="w-full px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-400 focus:border-cyan-500 outline-none text-center text-xs font-bold"
                            />
                            <span className="absolute right-1 top-0.5 text-slate-500">%</span>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(FoundationType).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleFoundationChange(type)}
                            className={`
                                flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all
                                ${config.foundationType === type 
                                    ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 font-medium shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                                    : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }
                            `}
                        >
                            {getIconForFoundation(type)}
                            <span>{type}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Roof Section */}
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-slate-400 uppercase">Loại mái</label>
                    <div className="flex items-center gap-2 text-xs">
                         <span className="text-slate-500">Hệ số:</span>
                         <div className="relative w-16">
                            <input
                                type="number"
                                min={0}
                                max={200}
                                value={Math.round(config.roofCoefficient * 100)}
                                onChange={(e) => handleChange('roofCoefficient', Number(e.target.value) / 100)}
                                className="w-full px-1 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-400 focus:border-cyan-500 outline-none text-center text-xs font-bold"
                            />
                            <span className="absolute right-1 top-0.5 text-slate-500">%</span>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    {Object.values(RoofType).map((type) => (
                        <button
                            key={type}
                            onClick={() => handleRoofChange(type)}
                            className={`
                                flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all
                                ${config.roofType === type 
                                    ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 font-medium shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' 
                                    : 'border-slate-700 bg-slate-800/30 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }
                            `}
                        >
                            {getIconForRoof(type)}
                            <span className="truncate" title={type}>{type}</span>
                        </button>
                    ))}
                </div>
            </div>

        </div>

        <div className="flex gap-4 pt-2">
            <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        checked={config.hasBasement}
                        onChange={(e) => handleChange('hasBasement', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">Có tầng hầm</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
                 <div className="relative">
                    <input 
                        type="checkbox" 
                        checked={config.hasTerrace}
                        onChange={(e) => handleChange('hasTerrace', e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </div>
                <span className="text-slate-300 group-hover:text-white transition-colors">Có sân thượng</span>
            </label>
        </div>
      </div>

      {/* Pricing Package */}
      <div className="space-y-4">
         <div className="flex items-center gap-2 text-slate-100 font-semibold text-lg border-b border-slate-800 pb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <h2>Đơn giá & Gói thầu</h2>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-400 mb-2 uppercase">Chọn gói xây dựng</label>
            <div className="grid grid-cols-1 gap-3">
                {Object.values(PackageType).map((pkg) => (
                     <label key={pkg} className={`
                        relative flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
                        ${config.packageType === pkg 
                            ? 'border-emerald-500 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                            : 'border-slate-700 bg-slate-800/20 hover:bg-slate-800'
                        }
                     `}>
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`
                                w-4 h-4 rounded-full border flex items-center justify-center
                                ${config.packageType === pkg ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'}
                            `}>
                                {config.packageType === pkg && <div className="w-2 h-2 rounded-full bg-white"></div>}
                            </div>
                            <input 
                                type="radio" 
                                name="packageType"
                                value={pkg}
                                checked={config.packageType === pkg}
                                onChange={() => handleChange('packageType', pkg)}
                                className="hidden"
                            />
                            {getIconForPackage(pkg)}
                            <div className="flex items-center gap-2">
                                <span className={`font-medium ${config.packageType === pkg ? 'text-emerald-400' : 'text-slate-300'}`}>{pkg}</span>
                                
                                <div className="group/tooltip relative z-20">
                                    <HelpCircle className="w-4 h-4 text-slate-600 hover:text-cyan-500 transition-colors cursor-help" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none text-center leading-relaxed">
                                        {PACKAGE_INFO[pkg]}
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-slate-600 rotate-45"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span className="text-sm text-slate-400 whitespace-nowrap font-mono">
                            {new Intl.NumberFormat('vi-VN').format(UNIT_PRICES[pkg])}
                        </span>
                     </label>
                ))}
            </div>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase">
                Đơn giá tùy chỉnh (VNĐ/m²) <span className="text-slate-600 font-normal lowercase">(Tùy chọn)</span>
            </label>
            <input
              type="number"
              placeholder="Nhập giá khác nếu cần..."
              value={config.customPrice || ''}
              onChange={(e) => handleChange('customPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2.5 bg-slate-950 rounded-lg border border-slate-700 text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none placeholder-slate-600"
            />
        </div>

      </div>

    </div>
  );
};

export default InputForm;