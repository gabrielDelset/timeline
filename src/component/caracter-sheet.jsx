import React, { useState ,  useEffect} from "react";
import "../css/Relation.css";
import empty from "../images/empty-cat.jpg";
import { AiFillCamera } from "react-icons/ai";

const Caractersheet = ({  selectedProfile , setPhoto , setName , setSurname , setDate}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto1] = useState(empty);



  useEffect(() => {
    try {
      
      if (selectedProfile !== 0) {
        setPhoto1(selectedProfile.photo);
        setFirstName(selectedProfile.firstName);
        setLastName(selectedProfile.lastName);
        setBirthDate(selectedProfile.naissance.split("T")[0]);
  
        // Ajout des setters pour textEditor
        setName(selectedProfile.firstName);
        setSurname(selectedProfile.lastName);
        setDate(selectedProfile.naissance);
        setPhoto(selectedProfile.photo);
      }
      if(selectedProfile.id === 0)
      {
        setPhoto1(empty);
        setFirstName("");
        setLastName("");
        setBirthDate("");
  
        // Réinitialisation
        setName("");
        setSurname("");
        setDate("");
        setPhoto("");
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedProfile]);
  




  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(event.target.files[0]); // Stocke le fichier sélectionné
        setPhoto1(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="divGlobal">
      <div className="baniereperso">
        <div className="imageperso">
          <label htmlFor="fileInput" style={{ cursor: "pointer", position: "relative" }}>
            <img src={photo} alt="Uploaded" className="preview" />
            <div
              className="icon"
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                background: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <AiFillCamera color="white" size={24} />
            </div>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="inputname">
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setName(e.target.value);
            }}
          />
        </div>
        <div className="inputname">
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setSurname(e.target.value);
            }}
          />
        </div>
        <div className="date">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
              setDate(e.target.value)
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Caractersheet;
