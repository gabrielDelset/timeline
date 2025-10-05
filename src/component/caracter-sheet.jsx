import React, { useState, useEffect } from "react";
import styled from "styled-components";
import empty from "../images/empty-cat.jpg";
import { AiFillCamera } from "react-icons/ai";

// ---------------- STYLED COMPONENTS ----------------

const Wrapper = styled.div`
  border: 1px solid white;
  padding: 10px;
`;

const Banner = styled.div`
  max-height: 45vh;
  height: 45vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const Preview = styled.img`
  height: 170px;
  width: 170px;
  border-radius: 85px;
  border: 2px solid black;
  object-fit: cover;
`;

const CameraIcon = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Caractersheet = ({ selectedProfile, setPhoto, setName, setSurname, setDate }) => {
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

        setName(selectedProfile.firstName);
        setSurname(selectedProfile.lastName);
        setDate(selectedProfile.naissance);
        setPhoto(selectedProfile.photo);
      }
      if (selectedProfile.id === 0) {
        setPhoto1(empty);
        setFirstName("");
        setLastName("");
        setBirthDate("");

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
        setPhoto(event.target.files[0]);
        setPhoto1(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Wrapper>
      <Banner>
        <ImageWrapper>
          <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
            <Preview src={photo} alt="Uploaded" />
            <CameraIcon>
              <AiFillCamera color="white" size={24} />
            </CameraIcon>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: "none" }}
          />
        </ImageWrapper>

        <InputWrapper>
          <Input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setName(e.target.value);
            }}
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setSurname(e.target.value);
            }}
          />
        </InputWrapper>

        <InputWrapper>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
              setDate(e.target.value);
            }}
          />
        </InputWrapper>
      </Banner>
    </Wrapper>
  );
};

export default Caractersheet;
