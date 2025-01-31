import React from "react";
import ProfileCard from "../component/caracter";
import '../css/Relation.css';
const profiles = [
    { "id": 1, "photo": "#", "firstName": "Jean", "lastName": "Dupont" },
    { "id": 2, "photo": "#", "firstName": "Marie", "lastName": "Curie" },
    { "id": 3, "photo": "#", "firstName": "Albert", "lastName": "Einstein" },
    { "id": 4, "photo": "#", "firstName": "Isaac", "lastName": "Newton" },
    { "id": 5, "photo": "#", "firstName": "Léonard", "lastName": "de Vinci" },
    { "id": 6, "photo": "#", "firstName": "Galileo", "lastName": "Galilei" },
    { "id": 7, "photo": "#", "firstName": "Nikola", "lastName": "Tesla" },
    { "id": 8, "photo": "#", "firstName": "Ada", "lastName": "Lovelace" },
    { "id": 9, "photo": "#", "firstName": "Charles", "lastName": "Darwin" },
    { "id": 10, "photo": "#", "firstName": "Thomas", "lastName": "Edison" },
    { "id": 11, "photo": "#", "firstName": "Alan", "lastName": "Turing" },
    { "id": 12, "photo": "#", "firstName": "Carl", "lastName": "Sagan" },
    { "id": 13, "photo": "#", "firstName": "Stephen", "lastName": "Hawking" },
    { "id": 14, "photo": "#", "firstName": "Rosalind", "lastName": "Franklin" },
    { "id": 15, "photo": "#", "firstName": "Katherine", "lastName": "Johnson" },
    { "id": 16, "photo": "#", "firstName": "Alexander", "lastName": "Fleming" },
    { "id": 17, "photo": "#", "firstName": "Gregor", "lastName": "Mendel" },
    { "id": 18, "photo": "#", "firstName": "Richard", "lastName": "Feynman" },
    { "id": 19, "photo": "#", "firstName": "Dmitri", "lastName": "Mendeleïev" },
    { "id": 20, "photo": "#", "firstName": "Barbara", "lastName": "McClintock" }
  ];

const Relationcaracter = () => {
  return (
    <div  className="fenetre">
        
    <div className="column-caracter">

      {profiles.map((profile) => (
        <ProfileCard 
          key={profile.id} 
          imageUrl={profile.photo} 
          firstName={profile.firstName} 
          lastName={profile.lastName} 
        />
      ))}
         
    </div>
    

    </div>
  );
};

export default Relationcaracter;
