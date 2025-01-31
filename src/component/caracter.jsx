import '../css/Home.css';

const ProfileCard = ({ imageUrl, firstName, lastName }) => (
  <div class="caracter">
    <img 
      src={imageUrl} 
      alt={`${firstName} ${lastName}`} 
      className="w-16 h-16 rounded-full object-cover"
    />
      <p className="text-lg font-semibold">{firstName}</p>
      <p className="text-gray-600">{lastName}</p>
  </div>
);

export default ProfileCard;
