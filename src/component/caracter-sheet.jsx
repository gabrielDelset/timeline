import React, { useState } from "react";
import "../css/Relation.css";
import empty from "../images/empty-cat.jpg";
import { AiFillCamera } from "react-icons/ai";

const Caractersheet = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState(empty);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
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
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="inputname">
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="date">
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Caractersheet;
