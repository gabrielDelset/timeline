import React, { memo } from "react";
import '../css/Home.css';

const ProfileCard = ({ id, imageUrl, firstName, lastName, onSelect }) => {
  return (
    <div className="caracter" onClick={() => onSelect(id)}> {/* Appel de onSelect */}
      <img 
        src={imageUrl} 
        alt={`${firstName} ${lastName}`} 
        className="previewSmall"
      />
      <p className="text-lg font-semibold">{firstName}</p>
      <p className="text-gray-600">{lastName}</p>
    </div>
  );
};

// Appliquer React.memo après la déclaration du composant
export default memo(ProfileCard);
