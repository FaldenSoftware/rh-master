
import React from 'react';
import { Alert } from "@/components/ui/alert";

interface AnimalProfileProps {
  animal: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    description: string;
    image_url: string;
    is_adopted: boolean;
    created_at: string;
  };
}

const AnimalProfile: React.FC<AnimalProfileProps> = ({ animal }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img 
            src={animal.image_url} 
            alt={animal.name}
            className="w-full h-auto rounded-md object-cover aspect-square"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{animal.name}</span>
              {animal.is_adopted ? (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Adopted</span>
              ) : (
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm">Not Adopted</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          {animal.is_adopted && (
            <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
              <p>Congratulations! {animal.name} has found a new home!</p>
            </Alert>
          )}
          
          <h2 className="text-2xl font-bold mb-4">{animal.name}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-500 text-sm">Species</p>
              <p className="font-medium">{animal.species}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Breed</p>
              <p className="font-medium">{animal.breed}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Age</p>
              <p className="font-medium">{animal.age} years old</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Gender</p>
              <p className="font-medium">{animal.gender}</p>
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 text-sm">Description</p>
            <p className="mt-1">{animal.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalProfile;
