import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Editor from "@monaco-editor/react"

const PasteDetail = () => {
  const { pasteId } = useParams();
  const [pasteContent, setPasteContent] = useState('');
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
          return (
            <div>
              <h2>Paste not found</h2>
            </div>
          );
        }
      } catch (error) {
          return (
            <div>
              <h2>There was an error rendering this paste or sumn man</h2>
            </div>
          );
      }
    };

    fetchPasteContent();
  }, [db, pasteId]);

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