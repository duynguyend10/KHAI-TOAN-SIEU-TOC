import React, { useMemo, useRef } from 'react';
import { CalculationResult } from '../types';
import { formatCurrency } from '../utils/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Calculator, AlertTriangle, Printer, FileSpreadsheet, FileText, Download, Image as ImageIcon } from 'lucide-react';

interface ResultsProps {
  result: CalculationResult;
}

// Adjusted colors for dark theme contrast
const COLORS = ['#22d3ee', '#34d399', '#facc15', '#f87171', '#a78bfa', '#e879f9'];
const RADIAN = Math.PI / 180;

const Results: React.FC<ResultsProps> = ({ result }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => {
    return result.breakdown.map((item) => ({
      name: item.name,
      value: item.convertedArea
    }));
  }, [result.breakdown]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#0f172a" 
        textAnchor="middle" 
        dominantBaseline="central"
        style={{ 
            fontSize: '11px', 
            fontWeight: 'bold',
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const generateChartImage = (): Promise<string | null> => {
    return new Promise((resolve) => {
        if (!chartRef.current) {
            resolve(null);
            return;
        }
        const svgElement = chartRef.current.querySelector('.recharts-surface');
        if (!svgElement) {
            resolve(null);
            return;
        }

        try {
            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svgElement);

            if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }

            const base64Svg = btoa(unescape(encodeURIComponent(source)));
            const svgUrl = `data:image/svg+xml;base64,${base64Svg}`;

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const exportWidth = 600;
                
                const bbox = svgElement.getBoundingClientRect();
                const ratio = bbox.height / bbox.width;
                const exportHeight = exportWidth * ratio;

                const scale = 2;
                canvas.width = exportWidth * scale;
                canvas.height = exportHeight * scale;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // For dark mode app, we still export white background chart for docs
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.scale(scale, scale);
                    ctx.drawImage(img, 0, 0, exportWidth, exportHeight);
                    
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    resolve(null);
                }
            };
            img.onerror = (e) => {
                console.error("Lỗi khi load ảnh SVG:", e);
                resolve(null);
            };
            img.src = svgUrl;
        } catch (e) {
            console.error("Lỗi tạo ảnh từ biểu đồ:", e);
            resolve(null);
        }
    });
  };

  const handleExportCSV = () => {
    let csvContent = "\uFEFFHạng mục,Diện tích thực (m2),Hệ số (%),Diện tích xây dựng (m2)\n";
    result.breakdown.forEach(item => {
        csvContent += `"${item.name}",${item.area},${item.coefficient * 100}%,${item.convertedArea}\n`;
    });
    csvContent += `\nTổng cộng,,,${result.totalConstructionArea}\n`;
    csvContent += `Đơn giá,,,${result.unitPrice}\n`;
    csvContent += `Thành tiền,,,${result.totalCost}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Du_Toan_CaptainDiDi10.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportImage = async () => {
      const pngUrl = await generateChartImage();
      if (pngUrl) {
          const link = document.createElement('a');
          link.href = pngUrl;
          link.download = 'Bieu_Do_CaptainDiDi10.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          alert("Không thể tạo ảnh từ biểu đồ.");
      }
  };

  const handleExportDoc = async (type: 'xls' | 'doc') => {
    const chartImage = await generateChartImage();
    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:${type === 'xls' ? 'excel' : 'word'}" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Times New Roman', Times, serif; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            td, th { border: 1px solid #000000; padding: 8px; vertical-align: middle; }
            .header-row { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            .title { font-size: 18px; font-weight: bold; text-align: center; color: #1e3a8a; border: none !important; }
            .total { color: #dc2626; font-weight: bold; }
        </style>
      </head>
      <body>
        <table style="width: 100%;">
            <tr>
                <td colspan="4" class="title" style="height: 40px; font-size: 20px;">
                    DỰ TOÁN CHI PHÍ - CAPTAINDIDI10 DESIGN BUILD
                </td>
            </tr>
            ${chartImage ? `
            <tr>
                <td colspan="4" style="text-align: center; border: none; padding: 20px;">
                    <div style="text-align: center;">
                        <img src="${chartImage}" width="600" style="width: 600px; height: auto;" alt="Chart" />
                    </div>
                </td>
            </tr>
            ` : ''}
            <tr class="header-row">
                <th>Hạng mục</th>
                <th>Diện tích thực (m²)</th>
                <th>Hệ số</th>
                <th>DT Xây dựng (m²)</th>
            </tr>
            ${result.breakdown.map((item) => `
              <tr>
                <td>${item.name} <span style="color: #666; font-size: 0.9em;">(${item.description})</span></td>
                <td style="text-align: center;">${item.area.toFixed(1)}</td>
                <td style="text-align: center;">${(item.coefficient * 100).toFixed(0)}%</td>
                <td style="text-align: right;">${item.convertedArea.toFixed(1)}</td>
              </tr>
            `).join('')}
             <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Tổng diện tích XD</td>
                <td style="text-align: right; font-weight: bold;">${result.totalConstructionArea.toFixed(1)} m²</td>
             </tr>
             <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">Đơn giá</td>
                <td style="text-align: right; font-weight: bold;">${formatCurrency(result.unitPrice)}</td>
             </tr>
             <tr>
                <td colspan="3" class="total" style="text-align: right; font-size: 14px;">THÀNH TIỀN</td>
                <td class="total" style="text-align: right; font-size: 14px;">${formatCurrency(result.totalCost)}</td>
             </tr>
        </table>
      </body>
      </html>
    `;

    const mimeType = type === 'xls' ? 'application/vnd.ms-excel' : 'application/msword';
    const blob = new Blob([tableHtml], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Du_Toan_CaptainDiDi10.${type}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 print:space-y-4">
      
      {/* Export Toolbar */}
      <div className="flex flex-wrap gap-2 justify-end print:hidden">
        <button onClick={handleExportCSV} className="btn-export bg-slate-800 border-slate-700 text-slate-300 hover:text-white">
            <FileText className="w-4 h-4" /> CSV
        </button>
        <button onClick={() => handleExportDoc('xls')} className="btn-export bg-slate-800 border-slate-700 text-emerald-400 hover:bg-emerald-900/20">
            <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>
        <button onClick={() => handleExportDoc('doc')} className="btn-export bg-slate-800 border-slate-700 text-blue-400 hover:bg-blue-900/20">
            <Download className="w-4 h-4" /> Word
        </button>
        <button onClick={handleExportImage} className="btn-export bg-slate-800 border-slate-700 text-purple-400 hover:bg-purple-900/20">
            <ImageIcon className="w-4 h-4" /> Ảnh Biểu đồ
        </button>
        <button onClick={() => window.print()} className="btn-export bg-cyan-600 text-white hover:bg-cyan-500 border-transparent shadow-[0_0_10px_rgba(8,145,178,0.5)]">
            <Printer className="w-4 h-4" /> In Báo Giá
        </button>
      </div>

      <style>{`
          .btn-export {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            border-width: 1px;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s;
          }
      `}</style>

      {/* Total Card */}
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden print:shadow-none print:border print:border-slate-300 print:text-black print:from-white print:to-white print:p-0">
        <div className="absolute top-0 right-0 p-4 opacity-10 print:hidden">
            <Calculator className="w-32 h-32 text-cyan-200" />
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl print:hidden"></div>
        
        <h3 className="text-cyan-200 text-sm font-medium uppercase tracking-wider mb-2 print:text-slate-600">Tổng dự toán xây dựng</h3>
        <div className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white print:text-black">
            {formatCurrency(result.totalCost)}
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center text-sm border-t border-cyan-700/50 pt-4 print:border-slate-300">
            <div>
                <span className="text-cyan-200 print:text-slate-600">Tổng diện tích sàn:</span>
                <div className="font-bold text-xl print:text-black">{result.totalConstructionArea.toFixed(1)} m²</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-cyan-700/50 print:hidden"></div>
            <div>
                <span className="text-cyan-200 print:text-slate-600">Đơn giá áp dụng:</span>
                <div className="font-bold text-xl print:text-black">{formatCurrency(result.unitPrice)} / m²</div>
            </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-700/50 print:shadow-none print:border print:border-slate-300 print:p-0 print:bg-white print:backdrop-blur-none">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 print:text-black">
            Bảng chiết tính diện tích
        </h3>
        <div className="overflow-x-auto rounded-lg border border-slate-800 print:border-none">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-800 text-slate-400 font-medium uppercase text-xs print:bg-slate-100 print:text-slate-700">
                    <tr>
                        <th className="px-4 py-3 print:border print:border-slate-300">Hạng mục</th>
                        <th className="px-4 py-3 text-right print:border print:border-slate-300">Diện tích (m²)</th>
                        <th className="px-4 py-3 text-center print:border print:border-slate-300">Hệ số</th>
                        <th className="px-4 py-3 text-right print:border print:border-slate-300">DT Xây dựng</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                    {result.breakdown.map((item, index) => {
                        const color = COLORS[index % COLORS.length];
                        return (
                            <tr key={index} className="hover:bg-slate-800/50 transition-colors print:hover:bg-transparent">
                                <td className="px-4 py-3 font-medium text-slate-200 print:text-black print:border print:border-slate-300">
                                    <div className="flex items-start gap-3">
                                        <div 
                                            className="w-3 h-3 rounded-full mt-1 flex-shrink-0 print:hidden" 
                                            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                                        ></div>
                                        <div>
                                            <div>{item.name}</div>
                                            <div className="text-xs text-slate-500 font-normal print:text-slate-500">{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-400 text-right print:text-black print:border print:border-slate-300">{item.area.toFixed(1)}</td>
                                <td className="px-4 py-3 text-cyan-400 font-semibold text-center print:text-black print:border print:border-slate-300">{(item.coefficient * 100).toFixed(0)}%</td>
                                <td className="px-4 py-3 font-bold text-slate-200 text-right print:text-black print:border print:border-slate-300">{item.convertedArea.toFixed(1)}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot className="bg-slate-800/50 border-t border-slate-700 print:bg-slate-100 print:border-slate-300">
                    <tr>
                        <td colSpan={3} className="px-4 py-3 text-right font-bold text-slate-300 print:text-black print:border print:border-slate-300">Tổng cộng</td>
                        <td className="px-4 py-3 font-bold text-cyan-400 text-lg text-right print:text-black print:border print:border-slate-300">{result.totalConstructionArea.toFixed(1)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
      </div>

      {/* Chart */}
      <div 
        ref={chartRef}
        className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-700/50 break-inside-avoid print:shadow-none print:border-none print:bg-white"
      >
         <h3 className="text-lg font-bold text-slate-100 mb-4 print:text-black">Phân bổ diện tích</h3>
         <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => {
                            const total = result.totalConstructionArea;
                            const percent = ((value / total) * 100).toFixed(1);
                            return [`${value.toFixed(1)} m² (${percent}%)`, 'Diện tích'];
                        }}
                        contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            borderRadius: '12px', 
                            border: '1px solid #334155', 
                            color: '#f8fafc',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' 
                        }}
                        itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4 flex gap-3 text-yellow-500 text-sm print:bg-white print:border-slate-300 print:text-slate-600">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p>
            <strong>Lưu ý:</strong> Kết quả dự toán từ hệ thống CaptainDiDi10 chỉ mang tính chất tham khảo (độ chính xác khoảng 95%). 
            Chi phí thực tế có thể thay đổi tùy thuộc vào điều kiện thi công và khảo sát thực địa.
        </p>
      </div>

    </div>
  );
};

export default Results;