import React, { useState } from "react"
import ReactQuill from "react-quill";
import styles from './TextEditor.module.scss';
import Toolbar from "../Toolbar";

const modules = {
  toolbar: {
    container: "#toolbar",
  },
};

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "header",
  "blockquote",
  "code-block",
  "indent",
  "list",
  "direction",
  "align",
  "link",
  "image",
  "video",
  "formula",
];

const TextEditor = ({ text, setText }) => {
  const handleBody = e => {
    setText(e);
  }

  return (
    <>
      <div className={styles.container}>
        <Toolbar />
        <ReactQuill
          placeholder="Введите текст"
          value={text}
          onChange={handleBody}
          modules={modules}
          formats={formats}
          style={{ height: '300px', maxHeight: "300px", overflow: 'auto'}}
        />
      </div>
    </>
  )
}

export default TextEditor;