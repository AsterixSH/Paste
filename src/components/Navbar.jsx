const Navbar = ({savePasteToFirebase, hidden, setHidden}) => {
    return (
        <nav className="px-4 text-white p-2 flex flex-row items-center gap-5 border-b border-zinc-700">
            <a href="/" className="flex flex-row items-center">
                <svg className="fill-[#dff976]" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 302.92 291.56" height="35">
                <g id="Layer_1-2" data-name="Layer 1">
                    <path className="asterisk" d="M31.81,242.34l52.25-72.7L0,141.62,26.51,62.1l83.3,28.02V0h83.3v90.12l84.06-28.02,25.75,79.52-83.3,28.02,51.5,72.7-67.4,49.22-52.25-74.22-52.25,74.22-67.4-49.22Z"/>
                </g>
                </svg>
                <span className="px-2 text-xl font-extralight">/</span>
                <span className="text-2xl font-black">Paste</span>
            </a>

            <div className="fixed py-2 px-4 flex flex-row border-zinc-700 right-0 gap-4">
                { !hidden ?
                <button onClick={() => setHidden(true)} className="bg-zinc-800 hover:bg-zinc-700 duration-150 text-white px-3 py-1 rounded-lg font-bold text-sm">    
                    Hidden
                </button>
                :
                <button onClick={() => setHidden(false)} className="hover:bg-primary/70 transition duration-150 bg-primary text-black px-3 py-1 rounded-lg font-bold text-sm">
                    Visible
                </button>
                }

                <button onClick={savePasteToFirebase}
                        className="hover:bg-primary/70 transition duration-150 bg-primary text-black px-6 py-1 rounded-lg font-bold text-sm">
                Upload
                </button>
            </div>
        </nav>
    );
}

export default Navbar;