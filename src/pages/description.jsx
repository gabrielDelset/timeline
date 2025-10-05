import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { insertJSon, getJson } from "../tools/API/api";
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
  height: 430px;          /* Hauteur fixe */
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
  text-decoration: none;
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #ffe3e3;
    border-color: #faa4a4;
  }

  &:active {
    background-color: #d33a2c;
    color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.12) 0 1px 3px 0 inset;
  }
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
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
`;

// ---------------- COMPONENT ----------------

const TextEditor = ({ item }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const editorRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getJson("timeline", "description", item.id);
        if (response) {
          const contentState = convertFromRaw(response);
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la timeline:", error);
      }
    };

    fetchData();
  }, [item.id]);

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
    insertJSon("timeline", "description", item.id, Jsoncontent);
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

      <EditorContainer onClick={() => editorRef.current.focus()}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          placeholder="Commencez à écrire..."
        />
      </EditorContainer>

      <SaveButtonContainer>
        <Button74 onClick={saveContent}>Sauvegarder</Button74>
      </SaveButtonContainer>
    </Wrapper>
  );
};

export default TextEditor;
