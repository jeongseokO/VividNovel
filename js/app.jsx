const { useState, useEffect, useRef } = React;

const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];

function App() {
  const [view, setView] = useState('home');
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState(null);
  const [file, setFile] = useState(null);
  const [novelData, setNovelData] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [publicProjects, setPublicProjects] = useState([]);
  const [publicCount, setPublicCount] = useState(8);
  const [showMyCount, setShowMyCount] = useState(8);
  const [activeTab, setActiveTab] = useState('characters');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    fetch('data/public-projects.json').then(res => res.json()).then(setPublicProjects);
  }, []);

  useEffect(() => {
    if (view !== 'home') return;
    function onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPublicCount(c => Math.min(publicProjects.length, c + 8));
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [view, publicProjects.length]);

  function openProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    setSelectedId(id);
    setFile(null);
    setNovelData(project.novelData || null);
    setView(project.step || 'upload');
  }

  function handleNewProject() {
    const id = Date.now();
    const project = { id, name: '제목 없음', step: 'upload', novelText: '', novelData: null };
    setProjects(prev => [...prev, project]);
    openProject(id);
  }

  function updateProject(id, data) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }

  async function readFile(f) {
    if (f.type === 'application/pdf') {
      const array = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: array }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(it => it.str).join(' ') + '\n';
      }
      return text;
    }
    return await f.text();
  }

  async function startGenerate() {
    if (!file || selectedId === null) {
      alert('파일을 선택하세요.');
      return;
    }
    const text = await readFile(file);
    const res = await fetch('data/novel.json');
    const data = await res.json();
    updateProject(selectedId, { step: 'setup', novelText: text, novelData: data });
    setNovelData(data);
    setView('setup');
  }

  function handleVoiceChange(idx, voice) {
    if (!novelData) return;
    const updated = {
      ...novelData,
      characters: novelData.characters.map((c, i) => i === idx ? { ...c, voice } : c)
    };
    setNovelData(updated);
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
    if (!novelData) return '';
    const voices = {};
    novelData.characters.forEach(c => voices[c.name] = c.voice);
    const res = await fetch('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script: `나레이션: ${text}`, voices })
    });
    const data = await res.json();
    return `data:audio/wav;base64,${data.audio}`;
  }

  async function startPlay() {
    const project = projects.find(p => p.id === selectedId);
    if (!project) return;
    const chunks = chunkText(project.novelText);
    setScenes([]);
    setCurrentSceneIdx(0);
    const preload = Math.min(5, chunks.length);
    for (let i = 0; i < preload; i++) {
      await generateScene(i);
    }
    setView('play');
    updateProject(selectedId, { step: 'play' });
    for (let i = 0; i < chunks.length; i++) {
      setCurrentSceneIdx(i);
      setIsAudioLoading(true);
      const src = await generateAudio(chunks[i]);
      setIsAudioLoading(false);
      audioRef.current.src = src;
      audioRef.current.play();
      const nextIdx = i + preload;
      if (nextIdx < chunks.length) generateScene(nextIdx);
      await new Promise(res => audioRef.current.onended = res);
    }
    audioRef.current.pause();
  }

  function renderHome() {
    const username = localStorage.getItem('username');
    return (
      <div className="home">
        <div className="home-header">
          <h1>VividNovel</h1>
          {!username && (
            <button className="login-btn" onClick={() => location.href = 'login.html'}>로그인</button>
          )}
        </div>
        <section className="my-projects">
          <div className="section-header">
            <h2>내 프로젝트</h2>
            <button className="new-project-btn" onClick={handleNewProject}>+ 새 프로젝트</button>
          </div>
          <div className="grid">
            {projects.slice(0, showMyCount).map(p => (
              <div key={p.id} className="project-card" onClick={() => openProject(p.id)}>
                <div className="thumb"></div>
                <p>{p.name}</p>
              </div>
            ))}
          </div>
          {projects.length > showMyCount && (
            <div className="more-wrapper">
              <button onClick={() => setShowMyCount(c => c + 8)}>더보기</button>
            </div>
          )}
        </section>
        <section className="public-projects">
          <h2>다른 프로젝트</h2>
          <div className="grid">
            {publicProjects.slice(0, publicCount).map((p, idx) => (
              <div key={idx} className="project-card">
                <img src={p.thumbnail} alt={p.title} />
                <p>{p.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  function renderUpload() {
    const project = projects.find(p => p.id === selectedId);
    return (
      <div className="main">
        <div className="topbar">
          <button onClick={() => setView('home')}>← 홈</button>
          <span>{project?.name}</span>
        </div>
        <div className="content">
          <p>소설 파일(txt, pdf)을 업로드하세요.</p>
          <input type="file" onChange={e => setFile(e.target.files[0])} accept=".txt,.text,.pdf" />
          <button onClick={startGenerate}>프로젝트 시작</button>
        </div>
      </div>
    );
  }

  function renderSetup() {
    if (!novelData) return null;
    const project = projects.find(p => p.id === selectedId);
    return (
      <div className="main">
        <div className="topbar">
          <button onClick={() => setView('home')}>← 홈</button>
          <span>{project?.name}</span>
        </div>
        <div className="content with-right-tabs">
          <div className="main-setup">
            {activeTab === 'characters' && (
              <div className="flex">
                {novelData.characters.map((ch, idx) => (
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
            {activeTab === 'backgrounds' && (
              <div className="flex">
                {novelData.backgrounds.map((bg, idx) => (
                  <div className="card" key={idx}>
                    <img src={bg.image} alt={bg.name} />
                    <h3>{bg.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="right-tabs">
            <div className={`tab ${activeTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveTab('characters')}>등장인물</div>
            <div className={`tab ${activeTab === 'backgrounds' ? 'active' : ''}`} onClick={() => setActiveTab('backgrounds')}>배경</div>
          </div>
        </div>
        <div className="controls">
          <button onClick={startPlay}>재생</button>
        </div>
      </div>
    );
  }

  function renderPlay() {
    return (
      <div className="scene-wrapper">
        {scenes[currentSceneIdx] && <img src={scenes[currentSceneIdx]} className="scene-image" alt="Scene" />}
        <button className="fullscreen-btn" onClick={() => {
          const el = document.querySelector('.scene-wrapper');
          if (!document.fullscreenElement) el.requestFullscreen();
          else document.exitFullscreen();
        }}>전체 화면</button>
        {isAudioLoading && <div className="loading-overlay"><div className="spinner"></div></div>}
        <audio ref={audioRef} />
      </div>
    );
  }

  if (view === 'home') return renderHome();
  if (view === 'upload') return renderUpload();
  if (view === 'setup') return renderSetup();
  if (view === 'play') return renderPlay();
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

