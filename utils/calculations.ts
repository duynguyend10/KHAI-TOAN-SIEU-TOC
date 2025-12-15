import { HouseConfig, CalculationResult, AreaBreakdownItem, PackageType } from '../types';
import { COEFFICIENTS, UNIT_PRICES } from '../constants';

export const calculateConstructionCost = (config: HouseConfig): CalculationResult => {
  const landArea = config.width * config.length;
  const breakdown: AreaBreakdownItem[] = [];

  // 1. Móng (Foundation)
  // Sử dụng hệ số từ config (người dùng có thể đã sửa)
  const foundationCoeff = config.foundationCoefficient;
  const foundationArea = landArea * foundationCoeff;
  breakdown.push({
    name: config.foundationType,
    area: landArea,
    coefficient: foundationCoeff,
    convertedArea: foundationArea,
    description: `Diện tích đất x ${Math.round(foundationCoeff * 100)}%`
  });

  // 2. Tầng hầm (Basement - Tùy chọn)
  if (config.hasBasement) {
    const basementCoeff = COEFFICIENTS.BASEMENT;
    const basementArea = landArea * basementCoeff;
    breakdown.push({
      name: 'Tầng hầm',
      area: landArea,
      coefficient: basementCoeff,
      convertedArea: basementArea,
      description: `Diện tích sàn x ${basementCoeff * 100}%`
    });
  }

  // 3. Các tầng (Floors)
  const floorsCoeff = COEFFICIENTS.FLOOR;
  for (let i = 1; i <= config.floors; i++) {
    breakdown.push({
      name: `Tầng ${i} (Sàn)`,
      area: landArea,
      coefficient: floorsCoeff,
      convertedArea: landArea * floorsCoeff,
      description: `100% diện tích sàn`
    });
  }

  // 4. Sân thượng (Terrace - Tùy chọn)
  if (config.hasTerrace) {
    const terraceCoeff = COEFFICIENTS.TERRACE;
    const terraceArea = landArea * terraceCoeff;
    breakdown.push({
      name: 'Sân thượng',
      area: landArea,
      coefficient: terraceCoeff,
      convertedArea: terraceArea,
      description: `Diện tích sàn x ${terraceCoeff * 100}%`
    });
  }

  // 5. Mái (Roof)
  // Sử dụng hệ số từ config
  const roofCoeff = config.roofCoefficient;
  const roofArea = landArea * roofCoeff;
  breakdown.push({
    name: config.roofType,
    area: landArea,
    coefficient: roofCoeff,
    convertedArea: roofArea,
    description: `Diện tích sàn x ${Math.round(roofCoeff * 100)}%`
  });

  // Tổng diện tích xây dựng (Total Construction Area)
  const totalConstructionArea = breakdown.reduce((sum, item) => sum + item.convertedArea, 0);

  // Đơn giá (Unit Price)
  const unitPrice = config.customPrice && config.customPrice > 0 
    ? config.customPrice 
    : UNIT_PRICES[config.packageType];

  // Tổng chi phí (Total Cost)
  const totalCost = totalConstructionArea * unitPrice;

  return {
    breakdown,
    totalConstructionArea,
    unitPrice,
    totalCost
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};