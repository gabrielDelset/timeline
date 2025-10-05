import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { postcaracter, modifycaracter, deletecaracter } from '../tools/API/api';
import { useAuth } from '../tools/AuthContext';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import _ from "lodash";
import emptyImage from "../images/empty-cat.jpg";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

// ---------------- STYLED COMPONENTS ----------------

const Wrapper = styled.div`
  border: 1px solid white;
  padding: 10px;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 10px;
  margin: 3px 0 15px 0;
`;

const EditorContainer = styled.div`
  height: 330px;          /* Hauteur fixe */
  padding: 10px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: text;
  overflow-y: auto;       /* Scroll seulement si le texte dépasse */
`;

const Button45 = styled.button`
  align-items: center;
  background-color: #ffe7e7;
  border: 1px solid #fee0e0;
  border-radius: 11px;
  box-sizing: border-box;
  color: #d33a2c;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  line-height: 33px;
  padding: 2px 12px;
  text-align: left;
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #ffe3e3;
    border-color: #faa4a4;
  }

  &:active {
    background-color: #d33a2c;
    color: #fff;
    box-shadow: rgba(0, 0, 0, 0.12) 0 1px 3px 0 inset;
  }
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 15px;
`;

const Button74 = styled.button`
  background-color: #fbeee0;
  border: 2px solid #422800;
  border-radius: 30px;
  box-shadow: #422800 4px 4px 0 0;
  color: #422800;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;

  &:hover {
    background-color: #fff;
  }

  &:active {
    box-shadow: #422800 2px 2px 0 0;
    transform: translate(2px, 2px);
  }

  &:disabled {
    background-color: #d3d3d3;
    border-color: #a0a0a0;
    color: #808080;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

// ---------------- COMPONENT ----------------

const TextEditor1 = ({ selectedProfile, photo, name, surname, date, onProfileDeleted, onProfileSaved }) => {
  const { email } = useAuth();
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [save, setSave] = useState(true);
  const [Delete, setDelete] = useState(true);

  useEffect(() => {
    try {
      if (selectedProfile !== 0) {
        const contentState = convertFromRaw(selectedProfile.description);
        setEditorState(EditorState.createWithContent(contentState));
        setDelete(false);
      }
      if (selectedProfile.id === 0) {
        setDelete(true);
        setEditorState(EditorState.createEmpty());
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedProfile]);

  useEffect(() => {
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    const Jsoncontent = JSON.stringify(rawContent, null, 2);
    const parsedJsoncontent = JSON.parse(Jsoncontent);

    if (name !== null && name !== "") {
      setSave(false);
    } else {
      setSave(true);
    }

    if (selectedProfile.id !== 0) {
      if (
        name === selectedProfile.firstName &&
        surname === selectedProfile.lastName &&
        photo === selectedProfile.photo &&
        date === selectedProfile.naissance &&
        _.isEqual(parsedJsoncontent, selectedProfile.description)
      ) {
        setSave(true);
      } else {
        setSave(false);
      }
    }
  }, [name, photo, surname, date, editorState]);

  const createNotification = (type) => {
    return () => {
      NotificationManager.listNotify = [];
      switch (type) {
        case "info":
          NotificationManager.info("personnage supprimé");
          break;
        case "success":
          NotificationManager.success("Peronnages sauvegardé", "Succès");
          break;
        case "success2":
          NotificationManager.success("Peronnages modifié", "Succès");
          break;
        default:
          break;
      }
    };
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const convertImageToFile = async (imagePath, fileName = "empty-cat.jpg") => {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const saveContent = async () => {
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    const Jsoncontent = JSON.stringify(rawContent, null, 2);

    if (photo === "") {
      photo = await convertImageToFile(emptyImage);
    }

    if (selectedProfile.id === 0) {
      postcaracter("timeline1", surname, photo, [email], name, date, Jsoncontent)
        .then(() => {
          createNotification("success")();
          onProfileSaved(selectedProfile);
        })
        .catch((error) => console.error("Erreur :", error));
    } else {
      modifycaracter(selectedProfile.id, "timeline1", surname, photo, [email], name, date, Jsoncontent)
        .then(() => {
          createNotification("success2")();
          onProfileSaved(selectedProfile);
        })
        .catch((error) => console.error("Erreur :", error));
    }
  };

  const deleteContent = () => {
    deletecaracter(selectedProfile.id, "timeline1", [email])
      .then(() => {
        createNotification("info")();
        onProfileDeleted(selectedProfile.id);
      })
      .catch((error) => console.error("Erreur :", error));
  };

  return (
    <Wrapper>
      <Toolbar>
        <Button45 onClick={() => toggleBlockType("header-one")}>Titre</Button45>
        <Button45 onClick={() => toggleBlockType("header-two")}>Sous Titre</Button45>
        <Button45 onClick={() => toggleBlockType("unordered-list-item")}>Liste à points</Button45>
        <Button45 onClick={() => toggleBlockType("ordered-list-item")}>Liste numérotée</Button45>
        <Button45 onClick={() => toggleInlineStyle("BOLD")}>Gras</Button45>
        <Button45 onClick={() => toggleInlineStyle("ITALIC")}>Italique</Button45>
        <Button45 onClick={() => toggleInlineStyle("UNDERLINE")}>Souligner</Button45>
      </Toolbar>

      <EditorContainer onClick={() => editorRef.current?.focus()}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Commencez à écrire..."
          ref={(editor) => (editorRef.current = editor)}
        />
      </EditorContainer>

      <SaveButtonContainer>
        <Button74 onClick={deleteContent} disabled={Delete}>Supprimer</Button74>
        <Button74 onClick={saveContent} disabled={save}>Sauvegarder</Button74>
      </SaveButtonContainer>

      <NotificationContainer />
    </Wrapper>
  );
};

export default TextEditor1;
