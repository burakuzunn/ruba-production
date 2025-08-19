"use client";

import React, { useState } from 'react'


import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Button } from './ui/button';
 
const CarCard = ({ car }:any) => {
  const [isSaved, setIsSaved] = useState(car.wishlisted);
const handleToggleSave = async (data:any)=>{
  
};
  return (
    <Card className="overflow-hidden hover:shadow-lg transition group">
      <div className="relative h-48">
        {car.images && car.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        ) : (
          <div></div>
        )}
        <Button variant='ghost' size='icon' className={`absolute top-2 right-2 bg-white/90 rounded-full p-1.5 ${isSaved ? "text-red-500 hover:text-red-400" : "text-gray-600 hover:text-gray-600"}`} 
        onClick={handleToggleSave}
        
        >
          <Heart className={isSaved?"fill-current":""} size={20} />
        </Button>
      </div>

      <CardContent className='p-4'>
        <div className='flex flex-col mb-2'>
          <h3 className='text-lg font-bold line-clamp-1' >{car.make} {car.model}</h3>
          <span className='text-xl font-bold text-blue-600' >${car.price.toLocaleString()}</span>
        </div>

        <div className='text-gray-600 mb-2 flex items-center'>
          <span>{car.year}</span>
          <span className='mx-2'>●</span>
          <span>{car.transmission}</span>
      
          <span className='mx-2'>●</span>

          <span>{car.fuelType}</span>

        </div>
      </CardContent>
    </Card>
  );
};
 
 export default CarCard 