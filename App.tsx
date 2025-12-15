import React, { useState, useEffect } from 'react';
import { HouseConfig, FoundationType, RoofType, PackageType, CalculationResult, ConstructionType } from './types';
import { calculateConstructionCost } from './utils/calculations';
import { INITIAL_WIDTH, INITIAL_LENGTH, INITIAL_FLOORS, COEFFICIENTS } from './constants';
import InputForm from './components/InputForm';
import Results from './components/Results';
import { Sparkles, RotateCcw, Save, FolderOpen, X, Trash2, Clock, HardHat } from 'lucide-react';

interface SavedConfig {
  id: string;
  name: string;
  timestamp: number;
  data: HouseConfig;
}

const App: React.FC = () => {
  // Giá trị mặc định
  const defaultConfig: HouseConfig = {
    constructionType: ConstructionType.TOWNHOUSE,
    width: INITIAL_WIDTH,
    length: INITIAL_LENGTH,
    floors: INITIAL_FLOORS,
    hasBasement: false,
    hasTerrace: false,
    foundationType: FoundationType.SINGLE,
    foundationCoefficient: COEFFICIENTS.FOUNDATION[FoundationType.SINGLE],
    roofType: RoofType.CONCRETE,
    roofCoefficient: COEFFICIENTS.ROOF[RoofType.CONCRETE],
    packageType: PackageType.FULL_AVERAGE,
    customPrice: undefined
  };

  const [config, setConfig] = useState<HouseConfig>(defaultConfig);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('construction_calculator_configs');
      if (saved) {
        setSavedConfigs(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu cũ:", error);
    }
  }, []);

  useEffect(() => {
    const newResult = calculateConstructionCost(config);
    setResult(newResult);
  }, [config]);

  const handleLoadExample = () => {
    setConfig({
      constructionType: ConstructionType.TOWNHOUSE,
      width: 5,
      length: 12,
      floors: 2,
      hasBasement: false,
      hasTerrace: false,
      foundationType: FoundationType.SINGLE,
      foundationCoefficient: 0.4,
      roofType: RoofType.CONCRETE,
      roofCoefficient: 0.4,
      packageType: PackageType.FULL_AVERAGE,
      customPrice: undefined
    });
  };

  const handleReset = () => {
    setConfig(defaultConfig);
  };

  const handleSaveConfig = () => {
    const defaultName = `${config.constructionType} ${config.width}x${config.length}m`;
    const name = window.prompt("Đặt tên cho phương án này:", defaultName);
    
    if (name === null) return;

    const newSavedConfig: SavedConfig = {
      id: Date.now().toString(),
      name: name.trim() || defaultName,
      timestamp: Date.now(),
      data: { ...config }
    };

    const updatedList = [newSavedConfig, ...savedConfigs];
    setSavedConfigs(updatedList);
    localStorage.setItem('construction_calculator_configs', JSON.stringify(updatedList));
  };

  const handleDeleteConfig = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc muốn xóa phương án này không?")) {
      const updatedList = savedConfigs.filter(item => item.id !== id);
      setSavedConfigs(updatedList);
      localStorage.setItem('construction_calculator_configs', JSON.stringify(updatedList));
    }
  };

  const handleSelectConfig = (savedItem: SavedConfig) => {
    setConfig(savedItem.data);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-12 print:bg-white print:text-black print:pb-0 relative overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 print:hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20 print:hidden shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-cyan-500/20">
                    <HardHat className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight">
                        CaptainDiDi10
                    </h1>
                    <p className="text-xs text-cyan-400 font-medium tracking-wider uppercase">Design & Build Construction</p>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Online v2.0
            </div>
        </div>
      </header>

      {/* Hero Image Section */}
      <div className="relative w-full h-64 md:h-80 bg-slate-900 overflow-hidden print:hidden border-b border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" 
            alt="Construction Site" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent flex items-end">
             <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
                 <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                    Khái Toán <span className="text-cyan-400">Siêu Tốc</span>
                 </h2>
                 <p className="text-slate-300 max-w-xl text-lg font-light">
                    Công nghệ tính toán chi phí xây dựng chính xác đến 95%. Tối ưu hóa ngân sách cho ngôi nhà mơ ước của bạn.
                 </p>
             </div>
          </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 print:p-0 print:max-w-none relative z-10">
        
        {/* Print Header */}
        <div className="hidden print:block text-center mb-8 border-b-2 border-black pb-4">
            <div className="flex justify-center mb-2">
               <span className="text-3xl font-bold">CaptainDiDi10 Design Build</span>
            </div>
            <p className="text-sm">Hotline: 0977.462.397 - Website: www.captaindidi10.com</p>
            <h2 className="text-2xl font-bold mt-4 uppercase">Bảng Dự Toán Chi Phí Xây Dựng</h2>
            <p className="text-sm mt-1">Ngày lập: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Input Panel */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 print:hidden">
                
                {/* Control Bar */}
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleLoadExample} className="btn-control bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700 hover:border-cyan-500/50">
                        <Sparkles className="w-4 h-4" /> Ví dụ mẫu
                    </button>
                    <button onClick={handleSaveConfig} className="btn-control bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700 hover:border-emerald-500/50">
                        <Save className="w-4 h-4" /> Lưu lại
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-control bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700 hover:border-blue-500/50">
                        <FolderOpen className="w-4 h-4" /> Mở ({savedConfigs.length})
                    </button>
                    <button onClick={handleReset} className="btn-control bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white">
                        <RotateCcw className="w-4 h-4" /> Làm mới
                    </button>
                </div>

                <InputForm config={config} onChange={setConfig} />
            </div>

            {/* Right Column: Results Panel */}
            <div className="lg:col-span-7 xl:col-span-8 print:col-span-12 print:w-full">
                {result && <Results result={result} />}
            </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 text-center border-t border-slate-800/50 mt-12 print:hidden">
        <p className="text-slate-500 text-sm">
            © 2025 <span className="text-cyan-500 font-semibold">CaptainDiDi10 Design Build</span>. 
            All rights reserved. Powered by Technology.
        </p>
      </footer>

      {/* Styles for Control Buttons */}
      <style>{`
          .btn-control {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              padding: 0.625rem;
              border-width: 1px;
              border-radius: 0.75rem;
              font-weight: 500;
              font-size: 0.875rem;
              transition: all 0.2s;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          }
      `}</style>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-cyan-500" />
                        Phương án đã lưu
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar">
                    {savedConfigs.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <Save className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Chưa có phương án nào được lưu.</p>
                        </div>
                    ) : (
                        savedConfigs.map((item) => (
                            <div 
                                key={item.id}
                                onClick={() => handleSelectConfig(item)}
                                className="group flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-800/30 hover:border-cyan-500/50 hover:bg-slate-800 cursor-pointer transition-all"
                            >
                                <div>
                                    <div className="font-semibold text-slate-200 group-hover:text-cyan-400">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(item.timestamp).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteConfig(item.id, e)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default App;