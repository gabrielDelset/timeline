import '../css/Home.css';

const ProfileCard = ({ id, imageUrl, firstName, lastName, onSelect, className }) => {


  return (
    <div className={`caracter ${className}`} onClick={() => onSelect(id)}>
      <img 
        src={imageUrl} 
        alt={`${firstName} ${lastName}`} 
        className="previewSmall"
      />
      <p className="text-lg font-semibold">{firstName}</p>
      <p className="text-gray-600">{lastName}</p>
    </div>
  );
}

export default ProfileCard;
