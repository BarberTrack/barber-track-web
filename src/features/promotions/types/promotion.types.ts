export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  conditions: {
    minAmount: number;
  };
}

export interface PromotionsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    promotions: Promotion[];
  };
}

export interface CreatePromotionDTO {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validTo: string;
  conditions: {
    minAmount: number;
  };
  isActive: boolean;
}

export interface PromotionFormData {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validTo: string;
  minAmount: number;
  isActive: boolean;
}

export interface PromotionState {
  promotions: Promotion[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface UpdatePromotionsRequest {
  promotions: CreatePromotionDTO[];
}
