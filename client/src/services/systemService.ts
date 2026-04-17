import { apiClient } from "./apiClient";

export interface HealthStatusResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export const getHealthStatus = async (): Promise<HealthStatusResponse> => {
  const response = await apiClient.get<HealthStatusResponse>("/health");
  return response.data;
};
