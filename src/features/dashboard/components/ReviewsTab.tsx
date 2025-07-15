import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/shadcn/card';
import { Button } from '../../../shared/components/shadcn/button';
import { Badge } from '../../../shared/components/shadcn/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../shared/components/shadcn/dialog';
import { Star, Check, X } from 'lucide-react';
import type { Review } from '../types/reviews.type';

interface ReviewsTabProps {
  reviews: Review[];
  businessId: string;
}

export const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
  const [moderateReviewModal, setModerateReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleModerateReview = (review: Review, action: 'approve' | 'reject') => {
    // TODO: Implementar la llamada a la API para moderar la reseña
    console.log(`${action} review:`, review);
    setModerateReviewModal(false);
    setSelectedReview(null);
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reseñas y Comentarios</CardTitle>
          <CardDescription>Modera las reseñas de tus clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay reseñas disponibles</p>
              </div>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
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
                      <p className="text-white-100">{review.comment}</p>
                      <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
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
                  </div>
                </Card>
              ))
            )}
          </div>
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
    </>
  );
}; 