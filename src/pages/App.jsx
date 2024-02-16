import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, addDoc, serverTimestamp } from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import firebaseConfig from '../components/firebaseConfig.jsx';
import PasteDetail from "./PasteDetail.jsx";
import MonacoEditor, { MonacoDiffEditor } from "react-monaco-editor";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// monaco.editor.create(document.getElementById('editor'), {
//   value: 'console.log("Hello, world")',
//   language: 'javascript',
// });

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

      const pasteRef = collection(db, 'pastes');
      // generates id using timestamp
      const newPaste = await addDoc(pasteRef, {
        content: pasteContent,
        timestamp: serverTimestamp(),
      });

      const pasteUrl = `/paste/${newPaste.id}`;
      navigate(pasteUrl);

      setPasteContent('');
    } catch (error) {
      console.error('Error saving the paste to firebase ', error);
    }
  };
  

  return (
    <div className="h-screen flex flex-col bg-background-gray">
      <navbar className="px-4 text-white p-2 flex flex-row items-center gap-5 border-b border-zinc-700">

        <a className="flex flex-row items-center">
          <svg class="fill-[#dff976]" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 302.92 291.56" height="35">
            <g id="Layer_1-2" data-name="Layer 1">
              <path class="asterisk" d="M31.81,242.34l52.25-72.7L0,141.62,26.51,62.1l83.3,28.02V0h83.3v90.12l84.06-28.02,25.75,79.52-83.3,28.02,51.5,72.7-67.4,49.22-52.25-74.22-52.25,74.22-67.4-49.22Z"/>
            </g>
          </svg>
          <span className="px-2 text-xl font-extralight">/</span>
          <span className="text-2xl font-bold">Paste</span>
        </a>

        <div className="fixed py-2 px-4 flex flex-row border-l border-zinc-700 right-0 gap-4">
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

        {/* <a className="text-sm font-light">Change Log</a> */}
      </navbar>

      <main className="grid grid-cols-6 h-full">

        <div className="flex flex-col border-r border-zinc-700 text-white">
          <h1 className='text-lg font-black my-2 mx-2'>Recent Pastes</h1>
          {pastes.map(paste => (
            <a href="{paste.id}" className='hover:bg-zinc-800/70 transition duration-150 py-1.5 px-3 mx-2 bg-zinc-800 rounded-lg my-1 flex flex-row'>
              <svg className="fill-zinc-400 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"/></svg>
              <span className='ml-2 text-sm overflow-hidden'>{paste.id}</span>           
            </a>
          ))}
        </div>
        
        <div id="editor" className='col-span-5 overflow-hidden'>
          <MonacoEditor
            theme="vs-dark"
            options={options}
            language="javascript"
            onChange={onChange}
            value={pasteContent}
          />
        </div>

        {/* <textarea
          value={pasteContent}
          onChange={(e) => setPasteContent(e.target.value)}
          placeholder="Enter your paste here..."
          className="p-2 resize-none outline-none bg-background-gray text-white col-span-5"
        ></textarea> */}
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/paste/:pasteId" element={<PasteDetail />} />
    </Routes>
  );
}

export default App;