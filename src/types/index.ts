

export enum MedicineType {
  TABLET = "TABLET",
  CAPSULE = "CAPSULE",
  LIQUID = "LIQUID",
  INJECTION = "INJECTION",
  CREAM = "CREAM",
  DROPS = "DROPS",
  INHALER = "INHALER",
  OTHER = "OTHER",
}

export enum FoodRelation {
  BEFORE_FOOD = "BEFORE_FOOD",
  AFTER_FOOD = "AFTER_FOOD",
  WITH_FOOD = "WITH_FOOD",
  ANY_TIME = "ANY_TIME",
}

export interface Dosage {
  morning: number;
  afternoon: number;
  evening: number;
  bedtime: number;
}

export interface Medicine {
  _id: string;
  name: string;
  type: MedicineType;
  dosage: Dosage;
  foodRelation: FoodRelation;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineFormData {
  name: string;
  type: MedicineType;
  dosage: Dosage;
  foodRelation: FoodRelation;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
