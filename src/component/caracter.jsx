import '../css/Home.css';

const ProfileCard = ({ id, imageUrl, firstName, lastName, onSelect }) => (
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

export default ProfileCard;
