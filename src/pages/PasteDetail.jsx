import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import MonacoEditor from "react-monaco-editor";

const PasteDetail = () => {
  const { pasteId } = useParams();
  const [pasteContent, setPasteContent] = useState('');
  const db = getFirestore();

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

  const options = {
    readOnly: true,
    fontSize: 13,
    lineHeight: 24,
    minimap: {
      enabled: false,
    },
  };

  return (
    <div className="h-screen flex justify-center items-center bg-background-gray">
      <MonacoEditor
        language="plaintext"
        theme="vs-dark"
        value={pasteContent}
        options={options}
        height="100vh"
        width="100vw"
      />
    </div>
  );
};

export default PasteDetail;