import React, { useState, useRef, useEffect } from "react";
import "../css/Popup.css";

import { insertJSon, getJson } from "../tools/API/api";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const TextEditor1 = (item) => {
  const [response, setResponse] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const editorRef = useRef(null);

  useEffect(() => {
  }, []);

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
    insertJSon("timeline", "description", item.item.id, Jsoncontent);
  };

  return (
    <div className="divGlobal">
      <div className="divButton">
        <button
          className="button-45"
          onClick={() => toggleBlockType("header-one")}
        >
          Titre
        </button>
        <button
          className="button-45"
          onClick={() => toggleBlockType("header-two")}
        >
          Sous Titre
        </button>
        <button
          className="button-45"
          onClick={() => toggleBlockType("unordered-list-item")}
        >
          liste a point
        </button>
        <button
          className="button-45"
          onClick={() => toggleBlockType("ordered-list-item")}
        >
          liste a numéro
        </button>

        <button className="button-45" onClick={() => toggleInlineStyle("BOLD")}>
          Gras
        </button>
        <button
          className="button-45"
          onClick={() => toggleInlineStyle("ITALIC")}
        >
          Italique
        </button>
        <button
          className="button-45"
          onClick={() => toggleInlineStyle("UNDERLINE")}
        >
          souligner
        </button>
      </div>
      <div
        style={{
          minHeight: "80%",
          padding: "10px",
          border: "1px solid #ccc",
        }}
        onClick={() => editorRef.current.focus()}
      >
        <div
          className="editor-container"
          onClick={() => editorRef.current.focus()}
        >
          <Editor
            ref={editorRef}
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={setEditorState}
            placeholder="Start typing..."
          />
        </div>
      </div>
      <div className="button-container-save">
        <button className="button-74 save-button" onClick={saveContent}>
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default TextEditor1;
