import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Editor from "@monaco-editor/react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/index.css';
import CodeIcon from '../components/CodeIcon.jsx';

const PasteDetail = () => {
  const { pasteId } = useParams();
  const [pasteContent, setPasteContent] = useState('');
  const [pasteNotFound, setPasteNotFound] = useState(false);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchPasteContent = async () => {
      try {
        const pasteDocRef = doc(db, 'pastes', pasteId);
        const pasteDocSnap = await getDoc(pasteDocRef);

        if (pasteDocSnap.exists()) {
          const pasteData = pasteDocSnap.data();
          setPasteContent(pasteData.content);

          // TODO: update this to display current syntax highlighting setting
          toast.info("Highlighting syntax for TypeScript", {icon: <CodeIcon />,})
        } else {
          setPasteNotFound(true);
        }
      } catch (error) {
          console.error('Error fetching paste content:', error);
          setError(error.message);
      }
    };

    fetchPasteContent();
  }, [db, pasteId]);

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


  if (error) {
    return (
        <div className="h-screen flex justify-center items-center bg-loading">
          <div className="bg-nav-gray rounded-lg p-8 text-white text-center shadow-xl">
            <h2 className="text-3xl font-semibold mb-4">Error fetching paste content</h2>
            <p className="text-sm">{error}</p>
          </div>
        </div>
    ); // for now we can show the error message but in future remove this so we dont leak bts shit
  }

  return (
      <div className='w-full h-screen'>
        <Editor
      theme="vs-dark"
      defaultLanguage="typescript"
      options={options}
      value={pasteContent}
      />
      <ToastContainer />
    </div>

  );
};

export default PasteDetail;