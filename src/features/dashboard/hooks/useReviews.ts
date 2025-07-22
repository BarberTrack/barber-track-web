import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  getReviewsWithFilters,
  setFilters,
  setCurrentPage,
  selectReviews,
  selectReviewsLoading,
  selectReviewsError,
  selectCurrentPage,
  selectTotalReviews,
  selectReviewsFilters,
} from '../store';
import { businessServices } from '../services/businessServices';
import type { ReviewStatus } from '../types/reviews.type';

export const useReviews = (businessId: string) => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const reviews = useAppSelector(selectReviews);
  const loading = useAppSelector(selectReviewsLoading);
  const error = useAppSelector(selectReviewsError);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalReviews = useAppSelector(selectTotalReviews);
  const filters = useAppSelector(selectReviewsFilters);

  // Fetch reviews with current filters
  const fetchReviews = useCallback(() => {
    if (!businessId) return;
    
    dispatch(getReviewsWithFilters({
      businessId,
      status: filters.status === 'all' ? undefined : filters.status as ReviewStatus,
      page: currentPage,
      limit: filters.limit,
    }));
  }, [dispatch, businessId, filters.status, filters.limit, currentPage]);

  // Load initial data
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Filter actions
  const handleStatusFilter = useCallback((status: 'approved' | 'rejected' | 'pending' | 'all') => {
    dispatch(setFilters({ status }));
  }, [dispatch]);

  const handleLimitChange = useCallback((limit: number) => {
    dispatch(setFilters({ limit }));
  }, [dispatch]);

  // Pagination actions
  const handlePageChange = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const goToNextPage = useCallback(() => {
    const totalPages = Math.ceil(totalReviews / filters.limit);
    if (currentPage < totalPages) {
      dispatch(setCurrentPage(currentPage + 1));
    }
  }, [dispatch, currentPage, totalReviews, filters.limit]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  }, [dispatch, currentPage]);

  // Delete review action
  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      await businessServices.deleteReview(reviewId);
      // Refetch reviews after successful deletion
      fetchReviews();
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }, [fetchReviews]);

  // Computed values with safe defaults
  const safeTotal = totalReviews || 0;
  const safeLimit = filters.limit || 10;
  const totalPages = Math.ceil(safeTotal / safeLimit);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const startIndex = totalReviews > 0 ? (currentPage - 1) * safeLimit + 1 : 0;
  const endIndex = Math.min(currentPage * safeLimit, safeTotal);



  return {
    // Data
    reviews: reviews?.reviews || [],
    averageRating: reviews?.averageRating || 0,
    
    // State
    loading,
    error,
    
    // Pagination
    currentPage,
    totalPages,
    totalReviews: safeTotal,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    
    // Filters
    currentStatus: filters.status,
    currentLimit: filters.limit,
    
    // Actions
    handleStatusFilter,
    handleLimitChange,
    handlePageChange,
    goToNextPage,
    goToPreviousPage,
    deleteReview,
    refetch: fetchReviews,
  };
}; 