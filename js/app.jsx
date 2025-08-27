
const { useState, useRef } = React;
const { useState, useRef, useEffect } = React;


const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];
const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];


function App() {
function App() {
  const [step, setStep] = useState('upload');
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState(() => projects[0]?.id || null);
  const [file, setFile] = useState(null);
  const [file, setFile] = useState(null);
  const [novelText, setNovelText] = useState('');
  const [novelData, setNovelData] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [publicProjects, setPublicProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('characters');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef(null);
  const audioRef = useRef(null);


  const handleFile = (e) => setFile(e.target.files[0]);
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    fetch('data/public-projects.json')
      .then(res => res.json())
      .then(setPublicProjects);
  }, []);

  useEffect(() => {
    setActiveTab('characters');
  }, [selectedId]);

  const selectedProject = projects.find(p => p.id === selectedId);

  function updateProject(id, data) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }

  function handleNewProject() {
    const id = Date.now();
    setProjects(prev => [...prev, { id, name: '제목 없음', step: 'upload', novelText: '', novelData: null }]);
    setSelectedId(id);
  }

  const handleFile = e => setFile(e.target.files[0]);


  async function readFile(f) {
  async function readFile(f) {
    if (f.type === 'application/pdf') {
    if (f.type === 'application/pdf') {
      const array = await f.arrayBuffer();
      const array = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: array }).promise;
      const pdf = await pdfjsLib.getDocument({ data: array }).promise;
      let text = '';
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      }
      return text;
      return text;
    }
    }
    return await f.text();
    return await f.text();
  }
  }


  async function startGenerate() {
  async function startGenerate() {
    if (!file) {
    if (!file || !selectedProject) {
      alert('파일을 선택하세요.');
      alert('파일을 선택하세요.');
      return;
      return;
    }
    }
    const text = await readFile(file);
    const text = await readFile(file);
    setNovelText(text);
    const res = await fetch('data/novel.json');
    const res = await fetch('data/novel.json');
    const data = await res.json();
    const data = await res.json();
    setNovelData(data);
    updateProject(selectedId, { step: 'setup', novelText: text, novelData: data });
    setStep('setup');
    setScenes([]);
    setCurrentSceneIdx(0);
  }
  }


  function handleVoiceChange(idx, voice) {
  function handleVoiceChange(idx, voice) {
    setNovelData(prev => ({
    const nd = selectedProject.novelData;
      ...prev,
    const updated = {
      characters: prev.characters.map((c, i) => i === idx ? { ...c, voice } : c)
      ...nd,
    }));
      characters: nd.characters.map((c, i) => i === idx ? { ...c, voice } : c)
    };
    updateProject(selectedId, { novelData: updated });
  }
  }


  function chunkText(text, size = 300) {
  function chunkText(text, size = 300) {
    const chunks = [];
    const chunks = [];
    let idx = 0;
    let idx = 0;
    while (idx < text.length) {
    while (idx < text.length) {
      chunks.push(text.slice(idx, idx + size));
      chunks.push(text.slice(idx, idx + size));
      idx += size;
      idx += size;
    }
    }
    return chunks;
    return chunks;
  }
  }


  async function generateScene(idx) {
  async function generateScene(idx) {
    return new Promise(resolve => {
    return new Promise(resolve => {
      setTimeout(() => {
      setTimeout(() => {
        const src = `https://placehold.co/400x300?text=Scene+${idx + 1}`;
        const src = `https://placehold.co/800x600?text=Scene+${idx + 1}`;
        setScenes(prev => [...prev, src]);
        setScenes(prev => [...prev, src]);
        resolve();
        resolve();
      }, 500);
      }, 500);
    });
    });
  }
  }


  async function generateAudio(text) {
  async function generateAudio(text) {
    const voices = {};
    const voices = {};
    novelData.characters.forEach(c => voices[c.name] = c.voice);
    selectedProject.novelData.characters.forEach(c => voices[c.name] = c.voice);
    const res = await fetch('/tts', {
    const res = await fetch('/tts', {
      method: 'POST',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: `나레이션: ${text}`, voices })
      body: JSON.stringify({ script: `나레이션: ${text}`, voices })
    });
    });
    const data = await res.json();
    const data = await res.json();
    return `data:audio/wav;base64,${data.audio}`;
    return `data:audio/wav;base64,${data.audio}`;
  }
  }


  async function startPlay() {
  async function startPlay() {
    setStep('play');
    if (!selectedProject) return;
    const chunks = chunkText(novelText);
    updateProject(selectedId, { step: 'play' });
    setScenes([]);
    setCurrentSceneIdx(0);
    const chunks = chunkText(selectedProject.novelText);
    const preloadCount = Math.min(5, chunks.length);
    const preloadCount = Math.min(5, chunks.length);
    for (let i = 0; i < preloadCount; i++) {
    for (let i = 0; i < preloadCount; i++) {
      generateScene(i);
      await generateScene(i);
    }
    }
    for (let i = 0; i < chunks.length; i++) {
    for (let i = 0; i < chunks.length; i++) {
      setCurrentSceneIdx(i);
      setIsAudioLoading(true);
      const src = await generateAudio(chunks[i]);
      const src = await generateAudio(chunks[i]);
      setIsAudioLoading(false);
      audioRef.current.pause();
      audioRef.current.src = src;
      audioRef.current.src = src;
      audioRef.current.play();
      audioRef.current.play();
      const nextSceneIdx = i + preloadCount;
      const nextSceneIdx = i + preloadCount;
      if (nextSceneIdx < chunks.length) {
      if (nextSceneIdx < chunks.length) {
        generateScene(nextSceneIdx);
        generateScene(nextSceneIdx);
      }
      }
      await new Promise(res => audioRef.current.onended = res);
      await new Promise(res => setTimeout(res, 5000));
    }
    audioRef.current.pause();
  }

  function toggleFullscreen() {
    const el = document.querySelector('.scene-wrapper');
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    }
  }
  }


  return (
  return (
    <div className="container">
    <div className="app">
      {step === 'upload' && (
      <aside className="sidebar">
        <div>
        <h1 onClick={() => setSelectedId(null)}>VividNovel</h1>
          <h1>VividNovel</h1>
        <div className="new-project" onClick={handleNewProject}>+ 새 프로젝트</div>
          <p>소설 파일(txt, pdf)을 업로드하세요.</p>
        <div className="projects">
          <input type="file" onChange={handleFile} accept=".txt,.text,.pdf" />
          {projects.map(p => (
          <button onClick={startGenerate}>프로젝트 시작</button>
            <div
              key={p.id}
              className={`project-item ${p.id === selectedId ? 'active' : ''}`}
              onClick={() => setSelectedId(p.id)}
            >
              {p.name}
            </div>
          ))}
        </div>
        </div>
      )}
      </aside>

      <main className="main">
      {step === 'setup' && novelData && (
        {selectedProject ? (
        <div>
          <>
          <h2>등장인물 &amp; 배경</h2>
            <div className="topbar">{selectedProject.name}</div>
          <div className="flex">
            {selectedProject.step === 'upload' && (
            {novelData.characters.map((ch, idx) => (
              <div className="content">
              <div className="card" key={idx}>
                <p>소설 파일(txt, pdf)을 업로드하세요.</p>
                <img src={ch.profileImage} alt={ch.name} />
                <input type="file" onChange={handleFile} accept=".txt,.text,.pdf" />
                <h3>{ch.name}</h3>
                <button onClick={startGenerate}>프로젝트 시작</button>
                <p>{ch.appearance}</p>
                <p>{ch.personality}</p>
                <label>Voice:
                  <select value={ch.voice} onChange={e => handleVoiceChange(idx, e.target.value)}>
                    {voiceOptions.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </label>
              </div>
              </div>
            ))}
            )}
          </div>

          <h2>배경</h2>
            {selectedProject.step === 'setup' && selectedProject.novelData && (
          <div className="flex">
              <div className="content with-right-tabs">
            {novelData.backgrounds.map((bg, idx) => (
                <div className="main-setup">
              <div className="card" key={idx}>
                  {activeTab === 'characters' && (
                <img src={bg.image} alt={bg.name} />
                    <div className="flex">
                <h3>{bg.name}</h3>
                      {selectedProject.novelData.characters.map((ch, idx) => (
                <p>{bg.mood}</p>
                        <div className="card" key={idx}>
                          <img src={ch.profileImage} alt={ch.name} />
                          <h3>{ch.name}</h3>
                          <p>{ch.appearance}</p>
                          <p>{ch.personality}</p>
                          <label>Voice:
                            <select value={ch.voice} onChange={e => handleVoiceChange(idx, e.target.value)}>
                              {voiceOptions.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'background' && (
                    <div className="flex">
                      {selectedProject.novelData.backgrounds.map((bg, idx) => (
                        <div className="card" key={idx}>
                          <img src={bg.image} alt={bg.name} />
                          <h3>{bg.name}</h3>
                          <p>{bg.mood}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === 'episode' && (
                    <div>
                      <p>Episode 준비 중...</p>
                    </div>
                  )}
                  <button onClick={startPlay}>재생 시작</button>
                </div>
                <aside className="right-tabs">
                  <div className={'tab '+(activeTab === 'characters'?'active':'')} onClick={() => setActiveTab('characters')}>캐릭터</div>
                  <div className={'tab '+(activeTab === 'background'?'active':'')} onClick={() => setActiveTab('background')}>배경</div>
                  <div className={'tab '+(activeTab === 'episode'?'active':'')} onClick={() => setActiveTab('episode')}>Episode</div>
                </aside>
              </div>
              </div>
            ))}
            )}
          </div>

          <button onClick={startPlay}>재생 시작</button>
            {selectedProject.step === 'play' && (
        </div>
              <div className="scene-wrapper">
      )}
                {scenes[currentSceneIdx] && (

                  <img
      {step === 'play' && (
                    src={scenes[currentSceneIdx]}
        <div>
                    alt={`Scene ${currentSceneIdx + 1}`}
          <h2>장면 재생</h2>
                    className="scene-image"
          <div id="sceneSection" className="flex">
                  />
            {scenes.map((src, idx) => (
                )}
              <img key={idx} src={src} alt={`Scene ${idx + 1}`} />
                <button className="fullscreen-btn" onClick={toggleFullscreen}>⤢</button>
            ))}
                {isAudioLoading && (
          </div>
                  <div className="loading-overlay">
          <audio ref={audioRef}></audio>
                    <div className="spinner"></div>
        </div>
                  </div>
      )}
                )}
                <audio ref={audioRef}></audio>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="topbar">Home</div>
            <div className="content">
              <div className="public-grid">
                {publicProjects.map(p => (
                  <div key={p.id} className="public-card">
                    <img src={p.thumbnail} alt={p.name} />
                    <h3>{p.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
    </div>
  );
  );
}
}


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
