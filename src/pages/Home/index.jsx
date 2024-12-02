import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { ToastContainer, toast } from 'react-toastify';
import CodeIcon from '../../components/CodeIcon.jsx';
import { options } from '../../components/editorOptions.jsx'
import Navbar from '../../components/Navbar.jsx';
import { getPastes, uploadPaste } from '../../services/firestore.js';

const Home = () => {
  const navigate = useNavigate();
  const [pasteContent, setPasteContent] = useState('');
  const [pastes, setPastes] = useState([]);
  const [hidden, setHidden] = useState(false);

  function onChange(newValue) {
    setPasteContent(newValue);
  }

  useEffect(() => {
    getPastes().then((pastes) => {
      setPastes(pastes);
    });
  }, []);

  const savePasteToFirebase = async () => {
    try {
      if (!pasteContent) {
        toast.error("You can't upload an empty paste!")
        return;
      }

      const newPaste = await uploadPaste(pasteContent, hidden);

      toast.success("Successfully uploaded paste!", {icon: <CodeIcon />,})

      const pasteUrl = `/paste/${newPaste.id}`;
      navigate(pasteUrl);

      setPasteContent('');
    } catch (error) {
      console.error('Error saving the paste to firebase ', error);
      toast.error("Error uploading your paste...")
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        stacked
        transition: Bounce
      />
      <div className="h-screen flex flex-col bg-background-gray">
        <Navbar savePasteToFirebase={savePasteToFirebase} hidden={hidden} setHidden={setHidden} />

        <main className="flex flex-row w-full h-full">

          <div className="w-1/4 flex flex-col border-r bg-background-gray border-zinc-700 text-white" style={{overflowY: 'auto', scrollbarWidth: 'none', scrollbarColor: 'transparent transparent'}}>
            <h1 className='text-lg font-black my-2 mx-2'>Recent Pastes</h1>
            {pastes.map((paste, index) => index < 25 && (
                <a key={paste.id} href={'paste/' + paste.id} className='hover:bg-zinc-800/70 transition duration-150 py-1.5 px-3 mx-2 bg-zinc-800 rounded-lg my-1 flex flex-row'>
                    <svg className="fill-zinc-400 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z"/>
                    </svg>
                    <span className='ml-2 text-sm overflow-hidden'>{paste.id}</span>
                </a>
            ))}
          </div>

          <div className='overflow-hidden w-full'>
            <Editor
                theme="vs-dark"
                defaultLanguage="javascript"
                minimap="false"
                onChange={onChange}
                options={options(false)}
            />
          </div>
        </main>
        
      </div>
    </>
  );
};

export default Home;
