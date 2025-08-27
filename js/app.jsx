const { useState, useEffect, useRef } = React;

const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];

function App() {
  const [view, setView] = useState('home'); // 'home','upload','characters','backgrounds','episodes','play'
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
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
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
    updateProject(selectedId, { step: 'characters', novelText: text, novelData: data });
    setNovelData(data);
    setView('characters');
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
        resolve(src);
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
    const newScenes = [];
    const newAudios = [];
    for (let i = 0; i < chunks.length; i++) {
      const sceneSrc = await generateScene(i);
      newScenes.push(sceneSrc);
      const audioSrc = await generateAudio(chunks[i]);
      newAudios.push(audioSrc);
    }
    setScenes(newScenes);
    setAudioSources(newAudios);
    setCurrentSceneIdx(0);
    setView('play');
    updateProject(selectedId, { step: 'play' });
    if (newAudios[0]) {
      audioRef.current.src = newAudios[0];
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function skip(sec) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + sec));
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function handleFullScreen() {
    const el = document.querySelector('.scene-wrapper');
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  }

  function renderControlBar() {
    if (view === 'home' || selectedId === null) return null;
    return (
      <aside className="controlbar">
        <div className="tabs">
          <div className={`tab ${view === 'upload' ? 'active' : ''}`} onClick={() => setView('upload')}>업로드</div>
          <div className={`tab ${view === 'characters' ? 'active' : ''}`} onClick={() => setView('characters')}>캐릭터</div>
          <div className={`tab ${view === 'backgrounds' ? 'active' : ''}`} onClick={() => setView('backgrounds')}>배경</div>
          <div className={`tab ${view === 'episodes' ? 'active' : ''}`} onClick={() => setView('episodes')}>에피소드</div>
        </div>
        {view !== 'play' && <button className="play-btn" onClick={startPlay}>재생</button>}
      </aside>
    );
  }

  function renderWithLayout(content) {
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
        {renderControlBar()}
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
    return renderWithLayout(content);
  }

  function renderUpload() {
    const content = (
      <div className="drop-zone" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <p>여기로 텍스트 문서나 PDF를 Drag&Drop하세요.</p>
      </div>
    );
    return renderWithLayout(content);
  }

  function renderCharacters() {
    if (!novelData) return renderUpload();
    const content = (
      <div className="main-setup">
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
      </div>
    );
    return renderWithLayout(content);
  }

  function renderBackgrounds() {
    if (!novelData) return renderUpload();
    const content = (
      <div className="main-setup">
        <div className="flex">
          {novelData.backgrounds.map((bg, idx) => (
            <div className="card" key={idx}>
              <img src={bg.image} alt={bg.name} />
              <h3>{bg.name}</h3>
            </div>
          ))}
        </div>
      </div>
    );
    return renderWithLayout(content);
  }

  function renderEpisodes() {
    const content = (
      <div className="main-setup">
        <p className="empty-info">아직 정보가 없습니다.</p>
      </div>
    );
    return renderWithLayout(content);
  }

  function renderPlay() {
    const content = (
      <div className="scene-wrapper">
        {scenes[currentSceneIdx] && <img src={scenes[currentSceneIdx]} className="scene-image" alt="Scene" />}
        {isAudioLoading && <div className="loading-overlay"><div className="spinner"></div></div>}
        <audio ref={audioRef} />
        <div className="video-controls">
          <button onClick={() => skip(-10)}>⏪ 10s</button>
          <button onClick={togglePlay}>{playing ? '❚❚' : '▶'}</button>
          <button onClick={() => skip(10)}>10s ⏩</button>
          <button onClick={handleFullScreen}>⛶</button>
        </div>
      </div>
    );
    return renderWithLayout(content);
  }

  if (view === 'home') return renderHome();
  if (view === 'upload') return renderUpload();
  if (view === 'characters') return renderCharacters();
  if (view === 'backgrounds') return renderBackgrounds();
  if (view === 'episodes') return renderEpisodes();
  if (view === 'play') return renderPlay();
  return renderHome();
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
