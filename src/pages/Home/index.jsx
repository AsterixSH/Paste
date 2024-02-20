import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, addDoc, serverTimestamp } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import firebaseConfig from '../../components/firebaseConfig.jsx';
import Editor from "@monaco-editor/react"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/index.css';
import CodeIcon from '../../components/CodeIcon.jsx';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Home = () => {
  const [pasteContent, setPasteContent] = useState('');
  const navigate = useNavigate();
  const [pastes, setPastes] = useState([]);

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
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
  };

  function onChange(newValue) {
    setPasteContent(newValue);
  }

  useEffect(() => {
    const fetchPastes = async () => {
      const pasteRef = collection(db, 'pastes');
      const pasteQuery = query(pasteRef);
      const querySnapshot = await getDocs(pasteQuery);

      const fetchedPastes = [];
      querySnapshot.forEach((doc) => {
        fetchedPastes.push({ id: doc.id, ...doc.data() });
      });
      setPastes(fetchedPastes);
    };

    fetchPastes();
  }, [db]);

  const savePasteToFirebase = async () => {
    try {

      // Check if paste content exceeds maximum allowed length of 5000 characters or 5000 lines
      if (pasteContent.length > 5000 && pasteContent.split('\n').length > 5000) {
        toast.error('Paste content exceeds maximum allowed length of 5,000 characters and 5,000 lines.', {icon: <CodeIcon />,});
        return

      } else if (pasteContent.length > 5000) {
        toast.error('Paste content exceeds maximum allowed length of 5,000 characters.', {icon: <CodeIcon />,});
        return

      } else if (pasteContent.split('\n').length > 5000) {
        toast.error('Paste content exceeds maximum allowed length of 5,000 lines.', {icon: <CodeIcon />,}); // yet to position, prob bottom right corner
        return
      }

      const pasteRef = collection(db, 'pastes');
      // generates id using timestamp
      const newPaste = await addDoc(pasteRef, {
        content: pasteContent,
        timestamp: serverTimestamp(),
      });

      toast.success("Successfully uploaded paste!", {icon: <CodeIcon />,})

      const pasteUrl = `/paste/${newPaste.id}`;
      navigate(pasteUrl);

      setPasteContent('');
    } catch (error) {
      console.error('Error saving the paste to firebase ', error);
      toast.error("Error saving the paste to database...")
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-gray">
      <navbar className="px-4 text-white p-2 flex flex-row items-center gap-5 border-b border-zinc-700">

        <a href="/" className="flex flex-row items-center">
          <svg className="fill-[#dff976]" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 302.92 291.56" height="35">
            <g id="Layer_1-2" data-name="Layer 1">
              <path className="asterisk" d="M31.81,242.34l52.25-72.7L0,141.62,26.51,62.1l83.3,28.02V0h83.3v90.12l84.06-28.02,25.75,79.52-83.3,28.02,51.5,72.7-67.4,49.22-52.25-74.22-52.25,74.22-67.4-49.22Z"/>
            </g>
          </svg>
          <span className="px-2 text-xl font-extralight">/</span>
          <span className="text-2xl font-bold">Paste</span>
        </a>

        <div className="fixed py-2 px-4 flex flex-row border-l border-zinc-700 right-0 gap-4">
          <input className="bg-zinc-800 text-sm text-white px-2 rounded-lg outline-none" type="text" name="" id="" placeholder="Password"/>

          <button onClick={savePasteToFirebase} className="hover:bg-primary/70 transition duration-150 bg-primary text-black px-3 py-1 rounded-lg font-bold text-sm">
            Upload
          </button>
          <button className="hover:bg-primary/70 transition duration-150 bg-primary text-black px-3 rounded-lg font-bold text-sm">
            Copy
          </button>
          <button className="hover:bg-primary/70 transition duration-150 bg-primary text-black px-3 rounded-lg font-bold text-sm">
            Clear
          </button>
        </div>
        <ToastContainer />

      </navbar>

      <main className="grid grid-cols-6 h-full">

        <div className="flex flex-col border-r bg-background-gray border-zinc-700 text-white">
          <h1 className='text-lg font-black my-2 mx-2'>Recent Pastes</h1>
          {pastes.map((paste, index) => index < 25 && (
            <a href={'paste/' + paste.id} className='hover:bg-zinc-800/70 transition duration-150 py-1.5 px-3 mx-2 bg-zinc-800 rounded-lg my-1 flex flex-row'>
              <svg className="fill-zinc-400 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"/></svg>
              <span className='ml-2 text-sm overflow-hidden'>{paste.id}</span>           
            </a>
          ))}
        </div>
        
        <div className='col-span-5 overflow-hidden'>
          <Editor
          theme="vs-dark"
          defaultLanguage="python"
          minimap="false"
          onChange={onChange}
          options={options}
          />
        </div>
        <ToastContainer />
      </main>
    </div>
  );
};

export default Home;
