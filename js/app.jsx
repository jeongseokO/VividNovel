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
  const [audioSources, setAudioSources] = useState([]);
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

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      startGenerate(f);
    }
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

  async function startGenerate(f) {
    const target = f || file;
    if (!target || selectedId === null) {
      alert('파일을 선택하세요.');
      return;
    }
    const text = await readFile(target);
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
    setAudioSources([]);
    for (let i = 0; i < chunks.length; i++) {
      await generateScene(i);
      const src = await generateAudio(chunks[i]);
      setAudioSources(prev => [...prev, src]);
    }
    setCurrentSceneIdx(0);
    setView('play');
    updateProject(selectedId, { step: 'play' });
    if (audioSources[0]) {
      audioRef.current.src = audioSources[0];
      audioRef.current.play();
    }
  }

  function prevScene() {
    if (currentSceneIdx > 0) {
      const idx = currentSceneIdx - 1;
      setCurrentSceneIdx(idx);
      if (audioSources[idx]) {
        audioRef.current.src = audioSources[idx];
        audioRef.current.play();
      }
    }
  }

  function nextScene() {
    if (currentSceneIdx < scenes.length - 1) {
      const idx = currentSceneIdx + 1;
      setCurrentSceneIdx(idx);
      if (audioSources[idx]) {
        audioRef.current.src = audioSources[idx];
        audioRef.current.play();
      }
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }

  function renderWithLayout(content, control) {
    const username = localStorage.getItem('username');
    return (
      <div className="app">
        <aside className="sidebar">
          <h1 onClick={() => { setView('home'); setSelectedId(null); }}>VividNovel</h1>
          <div className="projects">
            {projects.map(p => (
              <div key={p.id} className={`project-item ${p.id === selectedId ? 'active' : ''}`} onClick={() => openProject(p.id)}>{p.name}</div>
            ))}
            <div className="new-project" onClick={handleNewProject}>+ 새 프로젝트</div>
          </div>
        </aside>
        <main className="main">{content}</main>
        <aside className="controlbar">{control || <p className="empty-info">아직 정보가 없습니다.</p>}</aside>
        {!username && <button className="login-btn top-login" onClick={() => location.href = 'login.html'}>로그인</button>}
      </div>
    );
  }

  function renderHome() {
    const content = (
      <div className="home">
        <section className="my-projects">
          <div className="section-header">
            <h2>내 프로젝트</h2>
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
    return renderWithLayout(content, null);
  }

  function renderUpload() {
    const content = (
      <div className="drop-zone" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <p>여기로 텍스트 문서나 PDF를 Drag&Drop하세요.</p>
      </div>
    );
    return renderWithLayout(content, null);
  }

  function renderSetup() {
    if (!novelData) return renderUpload();
    const content = (
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
    );
    const control = (
      <div className="tabs">
        <div className={`tab ${activeTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveTab('characters')}>등장인물</div>
        <div className={`tab ${activeTab === 'backgrounds' ? 'active' : ''}`} onClick={() => setActiveTab('backgrounds')}>배경</div>
        <button className="play-btn" onClick={startPlay}>재생</button>
      </div>
    );
    return renderWithLayout(content, control);
  }

  function renderPlay() {
    const content = (
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
    const control = (
      <div className="play-controls">
        <button onClick={prevScene}>◀</button>
        <button onClick={togglePlay}>⏯</button>
        <button onClick={nextScene}>▶</button>
      </div>
    );
    return renderWithLayout(content, control);
  }

  if (view === 'home') return renderHome();
  if (view === 'upload') return renderUpload();
  if (view === 'setup') return renderSetup();
  if (view === 'play') return renderPlay();
  return renderHome();
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

