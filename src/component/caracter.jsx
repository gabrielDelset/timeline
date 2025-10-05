import styled from "styled-components";

const Card = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1vh;
  border: 1px solid #ccc;
  width: 100%;
  padding-left: 1vh;
  cursor: pointer;

  &:hover {
    background-color: rgba(144, 213, 236, 0.349);
  }

  &.selected {
    background-color: rgba(0, 123, 255, 0.5);
    color: white;
  }
`;

const PreviewSmall = styled.img`
  height: 4vh;
  width: 4vh;
  border-radius: 85px;
  border: 2px solid black;
  object-fit: cover;
`;

const FirstName = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;

const LastName = styled.p`
   font-size: 1rem;
  font-weight: 600;
`;

const ProfileCard = ({ id, imageUrl, firstName, lastName, onSelect, className }) => {
  return (
    <Card className={className} onClick={() => onSelect(id)}>
      <PreviewSmall 
        src={imageUrl} 
        alt={`${firstName} ${lastName}`} 
      />
      <FirstName>{firstName}</FirstName>
      <LastName>{lastName}</LastName>
    </Card>
  );
};

export default ProfileCard;
