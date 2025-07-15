export interface ReviewsResponseModel {
    success: boolean;
    message: string;
    data:    Reviews;
}

export interface Reviews {
    reviews:    Review[];
    statistics: Statistics;
}

export interface Review {
    id:                      string;
    appointmentId:           string;
    clientId:                string;
    businessId:              string;
    barberId:                string;
    userId:                  string;
    businessRating:          number;
    barberRating:            number;
    comment:                 string;
    status:                  string;
    isFeatured:              boolean;
    businessResponse:        null;
    moderationLogs:          null;
    createdAt:               Date;
    updatedAt:               Date;
    sentimentClassification: string;
    moderationReason:        string;
}

export interface Statistics {
    averageRating:      number;
    totalReviews:       number;
    ratingDistribution: { [key: string]: number };
}
