import React from 'react'
import { AddCarForm } from "../_components/add-car-form";
export const metadata = {
  title: "ruba",
  description: "ruba",
};

const AddCarPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Araç Ekle</h1>
      <AddCarForm />
    </div>
  );
};

export default AddCarPage