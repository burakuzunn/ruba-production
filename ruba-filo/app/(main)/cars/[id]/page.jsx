import React from "react";

const CarPage = ({ params }) => {
  const { id } = params; 
  console.log("CarPage id:", id);

  return (
    <div className="mt-20 text-red-500 text-2xl">
      CarPage: {id}
    </div>
  );
};

export default CarPage;