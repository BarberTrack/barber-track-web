import { Star, Phone, Mail, MapPin, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/shadcn/card'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 md:gap-6 p-4 md:p-8 max-w-7xl mx-auto">
                {businesses.map((barberia) => (
                    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group max-w-sm mx-auto w-full" key={barberia.id} onClick={() => handleCardClick(barberia.id)}    >
                        <div className="relative h-40 overflow-hidden rounded-t-lg">
                            {barberia.galleryImages === null ? <>
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">sin imagen</p>
                                </div>
                            </> : <>
                                <img
                                    src={barberia.galleryImages[0].url}
                                    alt={barberia.name}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                            </>}

                            <div className="absolute top-2 right-2">
                                <Badge className="bg-white text-gray-900 shadow-sm text-xs">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    {barberia.ratingAverage}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader className="pb-2 px-3 pt-3">
                            <CardTitle className="text-sm md:text-base text-blue-900 line-clamp-1">{barberia.name}</CardTitle>
                            <CardDescription className="text-xs text-gray-600 line-clamp-2">{barberia.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2 px-3 pb-3">
                            <div className="space-y-1.5 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1.5 text-blue-600 flex-shrink-0" />
                                    <span className="truncate">{barberia.address}</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-3 h-3 mr-1.5 text-blue-600 flex-shrink-0" />
                                    <span className="truncate">{barberia.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-3 h-3 mr-1.5 text-blue-600 flex-shrink-0" />
                                    <span className="truncate">{barberia.email}</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <Badge variant="secondary" className="text-xs px-2 py-0.5">{barberia.totalReviews} reseñas</Badge>
                                    <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">Activa</Badge>
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
