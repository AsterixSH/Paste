import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Editor from "@monaco-editor/react"

const PasteDetail = () => {
  const { pasteId } = useParams();
  const [pasteContent, setPasteContent] = useState('');
  const [pasteNotFound, setPasteNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
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
        } else {
          setPasteNotFound(true);
        }
      } catch (error) {
          console.error('Error fetching paste content:', error);
          setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPasteContent();
  }, [db, pasteId]);

  // imo using setters and if statements for stuff like this is stupid i know. but the other way i tried didnt work so here we are.
  if (loading) {
    return (
        <div className="h-screen flex justify-center items-center bg-gray-800">
          <div className="bg-gray-900 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-mono mb-1">Loading paste...</h2>
          </div>
        </div>
    );
  }

  if (pasteNotFound) {
    return (
        <div className="h-screen flex justify-center items-center bg-gray-800">
          <div className="bg-gray-900 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-mono mb-1">Sorry, this paste id is invalid :(</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-800">
        <div className="bg-gray-900 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-mono mb-1">Error fetching paste content</h2>
          <p className="text-red-500">{error}</p>
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
    </div>
  );
};

export default PasteDetail;