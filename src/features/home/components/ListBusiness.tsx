import { Plus, Star, Phone, Mail, MapPin, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/shadcn/card'
import { Button } from '@/shared/components/shadcn/button'
import { Badge } from '@/shared/components/shadcn/badge'
import { useBusiness } from '../hooks/useBusiness'
import { useNavigate } from 'react-router'

export const ListBusiness = () => {
    const { businesses } = useBusiness();
    const navigate = useNavigate();
    const handleCardClick = (businessId: string) => {
        navigate(`/dashboard/${businessId}`); 
    };
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((barberia) => (
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group" key={barberia.id} onClick={() => handleCardClick(barberia.id)}    >
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                            {barberia.galleryImages === null ? <>
                                <p>sin imagen</p>
                            </> : <>
                                <img
                                    src={barberia.galleryImages[0].url}
                                    alt={barberia.name}
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </>}

                            <div className="absolute top-4 right-4">
                                <Badge className="bg-white text-gray-900 shadow-sm">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {barberia.ratingAverage}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl text-blue-900">{barberia.name}</CardTitle>
                            <CardDescription className="text-sm text-gray-600">{barberia.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="truncate">{barberia.address}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                    <span>{barberia.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                    <span className="truncate">{barberia.email}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <Badge variant="secondary">{barberia.totalReviews} reseñas</Badge>
                                    <Badge className="bg-green-100 text-green-800">Activa</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {businesses.length === 0 && (
                <div className="h-screen text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay barberías registradas</h3>
                    <p className="text-gray-600 mb-4">Comienza agregando tu primera barbería</p>
                    {/* <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primera Barbería
            </Button> */}
                </div>
            )}
        </>
    )
}
