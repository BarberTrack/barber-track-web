import { ListBusiness } from '../components/ListBusiness';
export const HomePage = () => {

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-100 mb-2">Mis Barberías</h2>
      <p className="text-gray-200">Administra todas tus barberías desde un solo lugar</p>
    </div>
    <ListBusiness />
</main>
  )
}
