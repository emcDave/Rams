// src/services/api.ts
import axios from "axios";
import { Medicine, MedicineFormData, ApiResponse } from "../types";

export const API_BASE_URL = "http://localhost:8080";
// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const medicineApi = {
  // Get all medicines
  getAllMedicines: async (): Promise<Medicine[]> => {
    const response = await apiClient.get<Medicine[]>("/api/meds");
    return response.data;
  },

  // Get medicine by ID
  getMedicineById: async (id: string): Promise<Medicine> => {
    const response = await apiClient.get<Medicine>(`/api/med/${id}`);
    return response.data;
  },

  // Add new medicine
  addMedicine: async (medicine: MedicineFormData): Promise<Medicine> => {
    const response = await apiClient.post<ApiResponse<Medicine>>(
      "/api/med/add",
      medicine
    );
    return response.data.data;
  },

  // Update medicine
  updateMedicine: async (
    id: string,
    medicine: MedicineFormData
  ): Promise<Medicine> => {
    console.log(medicine);

    const response = await apiClient.patch<Medicine>(
      `/api/med/${id}`,
      medicine
    );
    return response.data;
  },

  // Delete medicine
  deleteMedicine: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/api/med/${id}`);
  },
};
