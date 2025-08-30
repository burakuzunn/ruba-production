import { CarsList } from "./_components/car-list";

export const metadata = {
  title: "Cars | Ruba Admin",
  description: "Ruba",
};

export default function CarsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Araç Yönetimi</h1>
      <CarsList />
    </div>
  );
}