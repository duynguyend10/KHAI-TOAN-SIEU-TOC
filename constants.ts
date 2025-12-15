import { FoundationType, RoofType, PackageType } from './types';

// Hệ số quy đổi diện tích (Phần trăm)
// Giá trị dựa trên gợi ý: Móng đơn 30%, Móng cọc 50%, Móng băng 70%, Móng bè 100%
export const COEFFICIENTS = {
  FOUNDATION: {
    [FoundationType.SINGLE]: 0.3, // 30%
    [FoundationType.PILE]: 0.5,   // 50%
    [FoundationType.ICE]: 0.7,    // 70%
    [FoundationType.RAFT]: 1.0,   // 100%
  },
  ROOF: {
    [RoofType.CONCRETE]: 0.4,       // 40% (Theo đề bài)
    [RoofType.CORRUGATED_IRON]: 0.2,// 20%
    [RoofType.TILE_TRUSS]: 0.7,     // 70%
    [RoofType.TILE_CONCRETE]: 1.0,  // 100%
  },
  FLOOR: 1.0,    // 100%
  BASEMENT: 1.5, // 150% (Ước lượng phổ biến)
  TERRACE: 0.5,  // 50% (Ước lượng phổ biến)
};

// Đơn giá tham khảo (VNĐ/m2)
export const UNIT_PRICES = {
  [PackageType.ROUGH]: 3800000,        // Cập nhật: 3.5 -> 3.8
  [PackageType.FULL_ONE_STORY]: 5000000, // Mới: Trọn gói - Nhà Trệt
  [PackageType.FULL_AVERAGE]: 6000000, // Cập nhật: 5.75 -> 6.0
  [PackageType.FULL_GOOD]: 7000000,    // Cập nhật: 6.6 -> 7.0
  [PackageType.FULL_PREMIUM]: 8000000, // Cập nhật: 7.5 -> 8.0
};

export const INITIAL_WIDTH = 5;
export const INITIAL_LENGTH = 12;
export const INITIAL_FLOORS = 2; // Ví dụ đề bài: 2 tầng