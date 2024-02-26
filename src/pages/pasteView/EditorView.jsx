import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Editor from "@monaco-editor/react"
import '../../assets/styles/index.css';

const EditorView = () => {
  const { pasteId } = useParams();
  const [pasteContent, setPasteContent] = useState('');
  const [pasteNotFound, setPasteNotFound] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const db = getFirestore();

  const options = {
    autoIndent: 'full',
    contextmenu: true,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: 'always',

    minimap: {
      enabled: false,
    },

    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18,
    },

    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: true,
    cursorStyle: 'line',
    automaticLayout: true,
  };

  const fetchPasteContent = async () => {
    try {
      const pasteDocRef = doc(db, 'pastes', pasteId);
      const pasteDocSnap = await getDoc(pasteDocRef);

      if (pasteDocSnap.exists()) {
        const pasteData = pasteDocSnap.data();
        if (pasteData.password) {
          setPasswordRequired(true);
        } else {
          setPasteContent(pasteData.content);
        }
      } else {
        setPasteNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching paste content:', error);
    }
  };

  useEffect(() => {
    fetchPasteContent();
  }, [db, pasteId]);

  const handlePasswordSubmit = async () => {
    try {
      const pasteDocRef = doc(db, 'pastes', pasteId);
      const pasteDocSnap = await getDoc(pasteDocRef);

      if (pasteDocSnap.exists()) {
        const pasteData = pasteDocSnap.data();
        if (pasteData.password === password) {
          setPasteContent(pasteData.content);
          setPasswordRequired(false);
        } else {
          setIncorrectPassword(true);
        }
      } else {
        setPasteNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching paste content:', error);
    }
  };

  if (pasteNotFound) {
    return (
      <div className="h-screen flex justify-center items-center bg-loading">
        <div className="bg-nav-gray rounded-lg p-8 text-white text-center shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">Invalid paste identifier</h2>
          <p className="text-lg mb-4">We couldn't find the paste you're looking for. It may have been removed or doesn't exist.</p>
          <p className="text-sm">Please check the ID and try again.</p>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="h-screen flex justify-center items-center bg-loading">
        <div className="bg-nav-gray rounded-lg p-8 text-white text-center shadow-xl">
          <h2 className="text-3xl font-semibold mb-4">Password Protected 🔒</h2>
          <p className="text-lg mb-3">This paste is securely encrypted and hashed server-side, ensuring the highest level of data security.</p>

          <div className="items-center">
            <input
              type="password"
              className="bg-zinc-800 text-sm text-white px-2 rounded-l-lg outline-none h-10"
              style={{ width: '200px' }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="hover:bg-primary/70 transition duration-150 bg-primary text-black px-3 rounded-r-lg font-bold text-sm h-10"
              onClick={handlePasswordSubmit}
            >
              <span>➔</span>
            </button>
          </div>

          {incorrectPassword && <p className="text-sm text-red-500">Invalid password. Please try again.</p>}
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen'>
      <Editor
        theme="vs-dark"
        defaultLanguage="python"
        options={options}
        value={pasteContent}
      />
    </div>
  );
};

export default EditorView;
