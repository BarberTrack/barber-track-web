export interface ReviewsResponseModel {
    success: boolean;
    message: string;
    data: Reviews;
}

export interface Reviews {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export interface Review {
    id: string;
    appointmentId: string;
    clientId: string;
    businessId: string;
    barberId: string;
    userId: string;
    businessRating: number;
    barberRating: number;
    comment: string;
    status: string;
    isFeatured: boolean;
    businessResponse: string | null;
    moderationLogs: string | null;
    createdAt: string;
    updatedAt: string;
    sentimentClassification: string;
    moderationReason: string | null;
}

// New types for filters and pagination
export interface ReviewsFilters {
    status?: 'approved' | 'rejected' | 'pending' | 'all';
    page: number;
    limit: number;
}

export interface ReviewsParams {
    businessId: string;
    status?: 'approved' | 'rejected' | 'pending' | 'all';
    page?: number;
    limit?: number;
}

export type ReviewStatus = 'approved' | 'rejected' | 'pending';

// Legacy interface for backward compatibility (can be removed later)
export interface Statistics {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: string]: number };
}
