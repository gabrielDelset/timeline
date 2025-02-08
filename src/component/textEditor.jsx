import React, { useState, useRef,useEffect } from "react";
import "../css/Popup.css";
import { postcaracter,modifycaracter, deletecaracter} from '../tools/API/api';
import { useAuth } from '../tools/AuthContext'; 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import _ from "lodash"; //permet de faire la comparaison JSON pour le texte importer et écrit
import emptyImage from "../images/empty-cat.jpg";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const TextEditor1 = ({ selectedProfile, photo, name, surname, date, onProfileDeleted , onProfileSaved  }) => {
  const { email } = useAuth();
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [save, setSave] = useState(true);
  const [Delete, setDelete] = useState(true);
  const emptyFile = new File([emptyImage], "empty-cat.jpg", { type: "image/jpeg" });

  useEffect(() => {
  try {
    if (selectedProfile !== 0) {
        const contentState = convertFromRaw(selectedProfile.description);
        setEditorState(EditorState.createWithContent(contentState));
        setDelete(false);
    }
    if(selectedProfile.id === 0)
    {
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
  const parsedJsoncontent = JSON.parse(Jsoncontent); // Convertir la string en objet

  if (name !== null && name !== "") {     
    setSave(false);
  } else {                            
    setSave(true);
  }
if(selectedProfile.id !==0){                   
  if (
    name === selectedProfile.firstName &&             
    surname === selectedProfile.lastName &&
    photo === selectedProfile.photo &&                      
    date === selectedProfile.naissance  &&
    _.isEqual(parsedJsoncontent, selectedProfile.description)
  ) {
    setSave(true);                             
  }else{

    setSave(false);  
  }
}
}, [name, photo, surname, date, editorState]);




  const createNotification = (type) => {
    return () => {
      NotificationManager.listNotify = []; // Réinitialise la file des notifications
      switch (type) {
        case 'info':
          NotificationManager.info('personnage supprimé');
          break;
        case 'success':
          NotificationManager.success('Peronnages sauvegardé', 'Succès');
          break;
        case 'success2':
          NotificationManager.success('Peronnages modifié', 'Succès');
          break;
        case 'warning':
          NotificationManager.warning('Attention', 'Close après 3000ms', 3000);
          break;
        case 'error':
          NotificationManager.error('Erreur', 'Click me!', 5000, () => {
            alert('callback');
          });
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
    console.log(photo)

    if(photo === "")          //si aucune photo n'est selectionné, on onvertis ml'image en fichier
    {
       photo = await convertImageToFile(emptyImage);
    }

    if (selectedProfile.id === 0)
    {
      postcaracter("timeline1", surname, photo, [email], name, date, Jsoncontent)
      .then((data) => {
      //  console.log("Réponse du serveur :", data);
        createNotification('success')();
        onProfileSaved(selectedProfile);
      })
      .catch((error) => console.error("Erreur :"));
    }else 
    {
      modifycaracter(selectedProfile.id,"timeline1", surname, photo, [email], name, date, Jsoncontent)
      .then((data) => {
        console.log("Réponse du serveur :", data);
        createNotification('success2')();
        onProfileSaved(selectedProfile);
      })
      .catch((error) => console.error("Erreur :", error));
    }

  };



  const deleteContent = () => {
    deletecaracter(selectedProfile.id,"timeline1",[email])
    .then((data) => {
      console.log("Réponse du serveur :", data);
      createNotification('info')();
      onProfileDeleted(selectedProfile.id);
    })
    .catch((error) => console.error("Erreur :", error));

  };

  return (
    <div className="divGlobal">
      <div className="divButton">
        <button className="button-45" onClick={() => toggleBlockType("header-one")}>Titre</button>
        <button className="button-45" onClick={() => toggleBlockType("header-two")}>Sous Titre</button>
        <button className="button-45" onClick={() => toggleBlockType("unordered-list-item")}>Liste à points</button>
        <button className="button-45" onClick={() => toggleBlockType("ordered-list-item")}>Liste numérotée</button>
        <button className="button-45" onClick={() => toggleInlineStyle("BOLD")}>Gras</button>
        <button className="button-45" onClick={() => toggleInlineStyle("ITALIC")}>Italique</button>
        <button className="button-45" onClick={() => toggleInlineStyle("UNDERLINE")}>Souligner</button>
      </div>
      <div className="editor-containercaracter" onClick={() => editorRef.current?.focus()}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Commencez à écrire..."
          ref={(editor) => (editorRef.current = editor)}
        />
      </div>
      <div className="button-container-save1">
        <button className="button-74 save-button" onClick={deleteContent} disabled={Delete} >Supprimer</button>
        <button className="button-74 save-button" onClick={saveContent} disabled={save}>
          Sauvegarder
        </button>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default TextEditor1;
