import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import MonacoEditor from "react-monaco-editor";

const PasteDetail = () => {
  const { pasteId } = useParams();
  const [pasteContent, setPasteContent] = useState('');
  const [pasteNotFound, setPasteNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const options = {
    readOnly: true,
    fontSize: 13,
    lineHeight: 24,
    minimap: {
      enabled: false,
    },
  };

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
