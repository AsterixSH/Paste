import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react"
import '../../assets/styles/index.css';
import { options } from '../../components/editorOptions.jsx';
import { fetchPaste } from '../../services/firestore.js';

const View = () => {
  const { pasteId } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPaste(pasteId).then((paste) => {
      if (paste) {
        setContent(paste.content);
      }
    });
  }, [pasteId]);

  if (!content) {
    return (
      <div className='flex flex-col w-full h-screen justify-center items-center bg-[#1e1e1e]'>

      </div> 
    );
  }

  return (
    <div className='w-full h-screen bg-[#1e1e1e]'>
      <Editor
        theme="vs-dark"
        defaultLanguage="python"
        options={options(true)}
        value={content}
      />
    </div>
  );
};

export default View;
