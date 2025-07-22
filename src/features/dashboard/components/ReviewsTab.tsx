import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/shadcn/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../shared/components/shadcn/dialog';
import { Star, Check, X, ChevronLeft, ChevronRight, Filter, Trash2 } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { ToastAlert } from '../../../shared/components/ToastAlert';
import type { Review } from '../types/reviews.type';

interface ReviewsTabProps {
  businessId: string;
}

export const ReviewsTab = ({ businessId }: ReviewsTabProps) => {
  const [moderateReviewModal, setModerateReviewModal] = useState(false);
  const [deleteReviewModal, setDeleteReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState(false);

  const {
    reviews,
    averageRating,
    loading,
    error,
    currentPage,
    totalPages,
    totalReviews,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    currentStatus,
    currentLimit,
    handleStatusFilter,
    handleLimitChange,
    goToNextPage,
    goToPreviousPage,
    handlePageChange,
    deleteReview,
  } = useReviews(businessId);

  const handleModerateReview = (review: Review, action: 'approve' | 'reject') => {
    // TODO: Implementar la llamada a la API para moderar la reseña
    console.log(`${action} review:`, review);
    setModerateReviewModal(false);
    setSelectedReview(null);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    
    setDeletingReview(true);
    try {
      const success = await deleteReview(selectedReview.id);
      if (success) {
        ToastAlert.success('Éxito', 'La reseña ha sido eliminada correctamente');
        setDeleteReviewModal(false);
        setSelectedReview(null);
      } else {
        ToastAlert.error('Error', 'No se pudo eliminar la reseña. Inténtalo de nuevo.');
      }
    } catch (error) {
      ToastAlert.error('Error', 'Ocurrió un error inesperado al eliminar la reseña');
    } finally {
      setDeletingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusFilterLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobadas';
      case 'rejected':
        return 'Rechazadas';
      case 'pending':
        return 'Pendientes';
      case 'all':
        return 'Todas';
      default:
        return status;
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reseñas y Comentarios</CardTitle>
          <CardDescription>Cargando reseñas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando reseñas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reseñas y Comentarios</CardTitle>
          <CardDescription>Error al cargar las reseñas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reseñas y Comentarios</CardTitle>
          <CardDescription>
            Modera las reseñas de tus clientes • Promedio: {(averageRating || 0).toFixed(1)} ⭐ • Total: {totalReviews || 0} reseñas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros y controles */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={currentStatus} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="approved">Aprobadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Mostrar:</span>
              <Select value={currentLimit.toString()} onValueChange={(value) => handleLimitChange(parseInt(value))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No hay reseñas {currentStatus !== 'all' ? `${getStatusFilterLabel(currentStatus).toLowerCase()}` : 'disponibles'}
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">Cliente</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.businessRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        {getStatusBadge(review.status)}
                      </div>
                      <p className="text-gray-200">{review.comment}</p>
                      {review.moderationReason && (
                        <p className="text-sm text-gray-300  p-2 rounded">
                          <strong>Razón de moderación:</strong> {review.moderationReason}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        <span>Sentimiento: {review.sentimentClassification}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {review.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setSelectedReview(review);
                              setModerateReviewModal(true);
                            }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleModerateReview(review, "reject")}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedReview(review);
                          setDeleteReviewModal(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} - {endIndex} de {totalReviews} reseñas
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={!hasPreviousPage}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show current page, first, last, and 2 pages around current
                      return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, filteredPages) => {
                      const prevPage = filteredPages[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <div key={page} className="flex items-center">
                          {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                          <Button
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={!hasNextPage}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Moderación de Reseñas */}
      <Dialog open={moderateReviewModal} onOpenChange={setModerateReviewModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Moderar Reseña</DialogTitle>
            <DialogDescription>¿Estás seguro de que quieres aprobar esta reseña?</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold">Cliente</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedReview.businessRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReview.comment}</p>
                {selectedReview.sentimentClassification && (
                  <p className="text-sm text-gray-500">
                    Sentimiento detectado: <span className="font-medium">{selectedReview.sentimentClassification}</span>
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModerateReviewModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => handleModerateReview(selectedReview!, "approve")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Aprobar Reseña
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Eliminación de Reseñas */}
      <Dialog open={deleteReviewModal} onOpenChange={setDeleteReviewModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Eliminar Reseña</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta reseña? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold">Cliente</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < selectedReview.businessRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {getStatusBadge(selectedReview.status)}
                </div>
                <p className="text-gray-200 p-3 rounded-lg">{selectedReview.comment}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteReviewModal(false)}
              disabled={deletingReview}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteReview}
              disabled={deletingReview}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deletingReview ? 'Eliminando...' : 'Eliminar Reseña'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 