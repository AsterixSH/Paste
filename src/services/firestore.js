import { getFirestore, collection, getDocs, query, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { app } from './config';

const db = getFirestore(app);

export const getPastes = async () => {
    const pasteRef = collection(db, 'pastes');
    const pasteQuery = query(pasteRef);
    const querySnapshot = await getDocs(pasteQuery);

    const pastes = [];
    querySnapshot.forEach((doc) => {
      pastes.push({ id: doc.id, ...doc.data() });
    });
    
    return pastes;
};

export const uploadPaste = async (content, visiblity) => {
    const pasteRef = collection(db, 'pastes');

    const pasteData = {
        content: content,
        timestamp: serverTimestamp(),
        visiblity: visiblity ? 'private' : 'public',
    };

    const newPaste = await addDoc(pasteRef, pasteData);

    console.log('Document written with ID: ', newPaste.id);

    return newPaste;
}

export const fetchPaste = async (pasteId) => {
    const pasteRef = doc(db, 'pastes', pasteId);
    const pasteDoc = await getDoc(pasteRef);

    if (pasteDoc.exists()) {
        return pasteDoc.data();
    } else {
        return null;
    }
}