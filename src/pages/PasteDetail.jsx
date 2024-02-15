import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

  return ( // probs need to make this look a bit cuter. but for now can stay ass.
    <div>
      <pre>{pasteContent}</pre>
    </div>
  );
};

export default PasteDetail;