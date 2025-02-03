import React, { useState, useRef,useEffect } from "react";
import "../css/Popup.css";
import { postcaracter} from '../tools/API/api';
import { useAuth } from '../tools/AuthContext'; 
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const TextEditor1 = ({ id , photo, name, surname, date }) => {
  const { email } = useAuth();
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  console.log("omg l'id" , id);





  const createNotification = (type) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info('Info message');
          break;
        case 'success':
          NotificationManager.success('Peronnages sauvegardé', 'Succès');
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

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    const Jsoncontent = JSON.stringify(rawContent, null, 2);

    if (!photo) {
      console.error("Aucune image sélectionnée !");
      return;
    }

    postcaracter("timeline1", surname, photo, [email], name, date, Jsoncontent)
      .then((data) => {
        console.log("Réponse du serveur :", data);
        createNotification('success')();
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
        <button className="button-74 save-button">Supprimer</button>
        <button className="button-74 save-button" onClick={saveContent} disabled={!photo}>
          Sauvegarder
        </button>
      </div>
      <NotificationContainer />
    </div>
  );
};

export default TextEditor1;
