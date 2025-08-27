const { useState, useRef, useEffect } = React;

const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];

function App() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState(() => projects[0]?.id || null);
  const [file, setFile] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [publicProjects, setPublicProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('characters');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef(null);

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
    const name = prompt('프로젝트 이름을 입력하세요');
    if (!name) return;
    const id = Date.now();
    setProjects(prev => [...prev, { id, name, step: 'upload', novelText: '', novelData: null }]);
    setSelectedId(id);
  }

  const handleFile = e => setFile(e.target.files[0]);

  async function readFile(f) {
    if (f.type === 'application/pdf') {
      const array = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: array }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      return text;
    }
    return await f.text();
  }

  async function startGenerate() {
    if (!file || !selectedProject) {
      alert('파일을 선택하세요.');
      return;
    }
    const text = await readFile(file);
    const res = await fetch('data/novel.json');
    const data = await res.json();
    updateProject(selectedId, { step: 'setup', novelText: text, novelData: data });
    setScenes([]);
    setCurrentSceneIdx(0);
  }

  function handleVoiceChange(idx, voice) {
    const nd = selectedProject.novelData;
    const updated = {
      ...nd,
      characters: nd.characters.map((c, i) => i === idx ? { ...c, voice } : c)
    };
    updateProject(selectedId, { novelData: updated });
  }

  function chunkText(text, size = 300) {
    const chunks = [];
    let idx = 0;
    while (idx < text.length) {
      chunks.push(text.slice(idx, idx + size));
      idx += size;
    }
    return chunks;
  }

  async function generateScene(idx) {
    return new Promise(resolve => {
      setTimeout(() => {
        const src = `https://placehold.co/800x600?text=Scene+${idx + 1}`;
        setScenes(prev => [...prev, src]);
        resolve();
      }, 500);
    });
  }

  async function generateAudio(text) {
    const voices = {};
    selectedProject.novelData.characters.forEach(c => voices[c.name] = c.voice);
    const res = await fetch('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: `나레이션: ${text}`, voices })
    });
    const data = await res.json();
    return `data:audio/wav;base64,${data.audio}`;
  }

  async function startPlay() {
    if (!selectedProject) return;
    updateProject(selectedId, { step: 'play' });
    setScenes([]);
    setCurrentSceneIdx(0);
    const chunks = chunkText(selectedProject.novelText);
    const preloadCount = Math.min(5, chunks.length);
    for (let i = 0; i < preloadCount; i++) {
      await generateScene(i);
    }
    for (let i = 0; i < chunks.length; i++) {
      setCurrentSceneIdx(i);
      setIsAudioLoading(true);
      const src = await generateAudio(chunks[i]);
      setIsAudioLoading(false);
      audioRef.current.pause();
      audioRef.current.src = src;
      audioRef.current.play();
      const nextSceneIdx = i + preloadCount;
      if (nextSceneIdx < chunks.length) {
        generateScene(nextSceneIdx);
      }
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

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 onClick={() => setSelectedId(null)}>VividNovel</h1>
        <div className="new-project" onClick={handleNewProject}>+ 새 프로젝트</div>
        <div className="projects">
          {projects.map(p => (
            <div
              key={p.id}
              className={`project-item ${p.id === selectedId ? 'active' : ''}`}
              onClick={() => setSelectedId(p.id)}
            >
              {p.name}
            </div>
          ))}
        </div>
      </aside>
      <main className="main">
        {selectedProject ? (
          <>
            <div className="topbar">{selectedProject.name}</div>
            {selectedProject.step === 'upload' && (
              <div className="content">
                <p>소설 파일(txt, pdf)을 업로드하세요.</p>
                <input type="file" onChange={handleFile} accept=".txt,.text,.pdf" />
                <button onClick={startGenerate}>생성 시작</button>
              </div>
            )}

            {selectedProject.step === 'setup' && selectedProject.novelData && (
              <div className="content with-right-tabs">
                <div className="main-setup">
                  {activeTab === 'characters' && (
                    <div className="flex">
                      {selectedProject.novelData.characters.map((ch, idx) => (
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
            )}

            {selectedProject.step === 'play' && (
              <div className="scene-wrapper">
                {scenes[currentSceneIdx] && (
                  <img
                    src={scenes[currentSceneIdx]}
                    alt={`Scene ${currentSceneIdx + 1}`}
                    className="scene-image"
                  />
                )}
                <button className="fullscreen-btn" onClick={toggleFullscreen}>⤢</button>
                {isAudioLoading && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                  </div>
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
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
