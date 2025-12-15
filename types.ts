export enum FoundationType {
  SINGLE = 'Móng đơn',
  PILE = 'Móng cọc',
  RAFT = 'Móng bè',
  ICE = 'Móng băng'
}

export enum RoofType {
  CONCRETE = 'Mái bê tông cốt thép',
  TILE_TRUSS = 'Mái ngói kèo sắt',
  TILE_CONCRETE = 'Mái ngói BTCT',
  CORRUGATED_IRON = 'Mái tôn'
}

export enum PackageType {
  ROUGH = 'Xây thô',
  FULL_ONE_STORY = 'Trọn gói - Nhà Trệt',
  FULL_AVERAGE = 'Trọn gói - Trung Bình',
  FULL_GOOD = 'Trọn gói - Khá',
  FULL_PREMIUM = 'Trọn gói - Cao Cấp'
}

export enum ConstructionType {
  ONE_STORY = 'Nhà Trệt',
  TOWNHOUSE = 'Nhà Phố',
  VILLA = 'Biệt Thự'
}

export interface HouseConfig {
  constructionType: ConstructionType; // Loại công trình mới
  width: number;
  length: number;
  floors: number;
  hasBasement: boolean;
  hasTerrace: boolean;
  foundationType: FoundationType;
  foundationCoefficient: number; // Hệ số móng (người dùng có thể sửa)
  roofType: RoofType;
  roofCoefficient: number; // Hệ số mái (người dùng có thể sửa)
  packageType: PackageType;
  customPrice?: number; // Tùy chọn giá riêng
}

export interface AreaBreakdownItem {
  name: string;
  area: number; // Diện tích thực
  coefficient: number; // Hệ số phần trăm
  convertedArea: number; // Diện tích quy đổi
  description: string;
}

export interface CalculationResult {
  breakdown: AreaBreakdownItem[];
  totalConstructionArea: number;
  unitPrice: number;
  totalCost: number;
}