const {
  useState,
  useEffect,
  useRef
} = React;
const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];
function App() {
  const [view, setView] = useState('home'); // 'home','project','generate','characters','backgrounds','episodes','play'
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
  const [genStatus, setGenStatus] = useState('idle');
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
    setView(project.step || 'project');
  }
  function handleNewProject() {
    const id = Date.now();
    const project = {
      id,
      name: '제목 없음',
      step: 'project',
      novelText: '',
      novelData: null,
      episodes: []
    };
    setProjects(prev => [...prev, project]);
    openProject(id);
  }
  function updateProject(id, data) {
    setProjects(prev => prev.map(p => p.id === id ? {
      ...p,
      ...data
    } : p));
  }
  function getCurrentProject() {
    return projects.find(p => p.id === selectedId);
  }
  function generateEpisode() {
    const project = getCurrentProject();
    if (!project) return;
    setGenStatus('generating');
    const episodes = project.episodes || [];
    const newEp = {
      id: Date.now(),
      title: `Episode ${episodes.length + 1}`,
      status: 'generating'
    };
    updateProject(selectedId, {
      episodes: [...episodes, newEp]
    });
    setTimeout(() => {
      const updatedProject = getCurrentProject();
      if (!updatedProject) return;
      updateProject(selectedId, {
        episodes: updatedProject.episodes.map(ep => ep.id === newEp.id ? {
          ...ep,
          status: 'available'
        } : ep)
      });
      setGenStatus('completed');
      setTimeout(() => setGenStatus('idle'), 1000);
    }, 1500);
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
      const pdf = await pdfjsLib.getDocument({
        data: array
      }).promise;
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
    updateProject(selectedId, {
      step: 'project',
      novelText: text,
      novelData: data
    });
    setNovelData(data);
    setView('project');
  }
  function handleVoiceChange(idx, voice) {
    if (!novelData) return;
    const updated = {
      ...novelData,
      characters: novelData.characters.map((c, i) => i === idx ? {
        ...c,
        voice
      } : c)
    };
    setNovelData(updated);
    updateProject(selectedId, {
      novelData: updated
    });
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: `나레이션: ${text}`,
        voices
      })
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
    updateProject(selectedId, {
      step: 'play'
    });
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
    if (!document.fullscreenElement) el.requestFullscreen();else document.exitFullscreen();
  }
  function renderControlBar() {
    if (view === 'home' || selectedId === null) return null;
    return /*#__PURE__*/React.createElement("aside", {
      className: "controlbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tabs"
    }, /*#__PURE__*/React.createElement("div", {
      className: `tab ${view === 'project' ? 'active' : ''}`,
      onClick: () => setView('project')
    }, "\uD504\uB85C\uC81D\uD2B8 \uD648"), /*#__PURE__*/React.createElement("div", {
      className: `tab ${view === 'generate' ? 'active' : ''}`,
      onClick: () => setView('generate')
    }, "\uC0DD\uC131"), /*#__PURE__*/React.createElement("div", {
      className: `tab ${view === 'characters' ? 'active' : ''}`,
      onClick: () => setView('characters')
    }, "\uCE90\uB9AD\uD130"), /*#__PURE__*/React.createElement("div", {
      className: `tab ${view === 'backgrounds' ? 'active' : ''}`,
      onClick: () => setView('backgrounds')
    }, "\uBC30\uACBD"), /*#__PURE__*/React.createElement("div", {
      className: `tab ${view === 'episodes' ? 'active' : ''}`,
      onClick: () => setView('episodes')
    }, "\uC5D0\uD53C\uC18C\uB4DC")));
  }
  function renderWithLayout(content) {
    const username = localStorage.getItem('username');
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "sidebar"
    }, /*#__PURE__*/React.createElement("h1", {
      onClick: () => {
        setView('home');
        setSelectedId(null);
      }
    }, "VividNovel"), /*#__PURE__*/React.createElement("div", {
      className: "projects"
    }, projects.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: `project-item ${p.id === selectedId ? 'active' : ''}`,
      onClick: () => openProject(p.id)
    }, p.name)))), /*#__PURE__*/React.createElement("main", {
      className: "main"
    }, content), renderControlBar(), /*#__PURE__*/React.createElement("button", {
      className: "login-btn top-login",
      onClick: handleAuth
    }, username ? '로그아웃' : '로그인'), /*#__PURE__*/React.createElement("button", {
      className: "new-project-btn floating-new-project",
      onClick: handleNewProject
    }, "+ \uC0C8 \uD504\uB85C\uC81D\uD2B8"));
  }
  function handleAuth() {
    const username = localStorage.getItem('username');
    if (username) {
      localStorage.removeItem('username');
    }
    location.href = 'login.html';
  }
  function renderHome() {
    const content = /*#__PURE__*/React.createElement("div", {
      className: "home"
    }, /*#__PURE__*/React.createElement("section", {
      className: "my-projects"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-header"
    }, /*#__PURE__*/React.createElement("h2", null, "\uB0B4 \uD504\uB85C\uC81D\uD2B8")), /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, projects.slice(0, showMyCount).map(p => /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "project-card",
      onClick: () => openProject(p.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "thumb"
    }), /*#__PURE__*/React.createElement("p", null, p.name)))), projects.length > showMyCount && /*#__PURE__*/React.createElement("div", {
      className: "more-wrapper"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setShowMyCount(c => c + 8)
    }, "\uB354\uBCF4\uAE30"))), /*#__PURE__*/React.createElement("section", {
      className: "public-projects"
    }, /*#__PURE__*/React.createElement("h2", null, "\uB2E4\uB978 \uD504\uB85C\uC81D\uD2B8"), /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, publicProjects.slice(0, publicCount).map((p, idx) => /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "project-card"
    }, /*#__PURE__*/React.createElement("img", {
      src: p.thumbnail,
      alt: p.title
    }), /*#__PURE__*/React.createElement("p", null, p.title))))));
    return renderWithLayout(content);
  }
  function renderProjectHome() {
    const project = getCurrentProject();
    const content = /*#__PURE__*/React.createElement("div", {
      className: "project-home"
    }, /*#__PURE__*/React.createElement("div", {
      className: "drop-zone",
      onDragOver: e => e.preventDefault(),
      onDrop: handleDrop
    }, /*#__PURE__*/React.createElement("p", null, "\uC5EC\uAE30\uB85C \uD14D\uC2A4\uD2B8 \uBB38\uC11C\uB098 PDF\uB97C Drag&Drop\uD558\uC138\uC694.")), project?.novelData && /*#__PURE__*/React.createElement("div", {
      className: "doc-info"
    }, /*#__PURE__*/React.createElement("h3", null, "\uBB38\uC11C \uC815\uBCF4"), /*#__PURE__*/React.createElement("p", null, `\uBB38\uC11C \uAE38\uC774: ${project.novelText.length}\uC790`), /*#__PURE__*/React.createElement("p", null, `\uCE90\uB9AD\uD130 \uC218: ${project.novelData.characters.length}`), /*#__PURE__*/React.createElement("p", null, `\uBC30\uACBD \uC218: ${project.novelData.backgrounds.length}`)));
    return renderWithLayout(content);
  }
  function renderCharacters() {
    if (!novelData) return renderProjectHome();
    const content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex"
    }, novelData.characters.map((ch, idx) => /*#__PURE__*/React.createElement("div", {
      className: "card",
      key: idx
    }, /*#__PURE__*/React.createElement("img", {
      src: ch.profileImage,
      alt: ch.name
    }), /*#__PURE__*/React.createElement("h3", null, ch.name), /*#__PURE__*/React.createElement("p", null, ch.appearance), /*#__PURE__*/React.createElement("p", null, ch.personality), /*#__PURE__*/React.createElement("label", null, "Voice:", /*#__PURE__*/React.createElement("select", {
      value: ch.voice,
      onChange: e => handleVoiceChange(idx, e.target.value)
    }, voiceOptions.map(v => /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, v))))))));
    return renderWithLayout(content);
  }
  function renderBackgrounds() {
    if (!novelData) return renderProjectHome();
    const content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex"
    }, novelData.backgrounds.map((bg, idx) => /*#__PURE__*/React.createElement("div", {
      className: "card",
      key: idx
    }, /*#__PURE__*/React.createElement("img", {
      src: bg.image,
      alt: bg.name
    }), /*#__PURE__*/React.createElement("h3", null, bg.name)))));
    return renderWithLayout(content);
  }
  function renderEpisodes() {
    const project = getCurrentProject();
    const episodes = project?.episodes || [];
    const content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("section", {
      className: "episodes-section"
    }, /*#__PURE__*/React.createElement("h3", null, "\uC5D0\uD53C\uC18C\uB4DC"), episodes.length === 0 ? /*#__PURE__*/React.createElement("p", {
      className: "empty-info"
    }, "\uC774\uC804 \uC5D0\uD53C\uC18C\uB4DC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.") : /*#__PURE__*/React.createElement("ul", {
      className: "episode-list"
    }, episodes.map(ep => /*#__PURE__*/React.createElement("li", {
      key: ep.id
    }, `${ep.title} - ${ep.status === 'generating' ? '\uC0DD\uC131 \uC911' : 'Available'}`)))));
    return renderWithLayout(content);
  }

  function renderGenerate() {
    const content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("section", {
      className: "episodes-section"
    }, /*#__PURE__*/React.createElement("h3", null, "\uC5D0\uD53C\uC18C\uB4DC \uC0DD\uC131"), genStatus === 'idle' && /*#__PURE__*/React.createElement("button", {
      className: "generate-episode-btn",
      onClick: generateEpisode
    }, "\uC0DD\uC131 \uC2DC\uC791"), genStatus === 'generating' && /*#__PURE__*/React.createElement("p", null, "\uC0DD\uC131\uC911..."), genStatus === 'completed' && /*#__PURE__*/React.createElement("p", null, "\uC0DD\uC131 \uC644\uB8CC!")));
    return renderWithLayout(content);
  }
  function renderPlay() {
    const content = /*#__PURE__*/React.createElement("div", {
      className: "scene-wrapper"
    }, scenes[currentSceneIdx] && /*#__PURE__*/React.createElement("img", {
      src: scenes[currentSceneIdx],
      className: "scene-image",
      alt: "Scene"
    }), isAudioLoading && /*#__PURE__*/React.createElement("div", {
      className: "loading-overlay"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spinner"
    })), /*#__PURE__*/React.createElement("audio", {
      ref: audioRef
    }), /*#__PURE__*/React.createElement("div", {
      className: "video-controls"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => skip(-10)
    }, "\u23EA 10s"), /*#__PURE__*/React.createElement("button", {
      onClick: togglePlay
    }, playing ? '❚❚' : '▶'), /*#__PURE__*/React.createElement("button", {
      onClick: () => skip(10)
    }, "10s \u23E9"), /*#__PURE__*/React.createElement("button", {
      onClick: handleFullScreen
    }, "\u26F6")));
    return renderWithLayout(content);
  }
  if (view === 'home') return renderHome();
  if (view === 'project') return renderProjectHome();
  if (view === 'generate') return renderGenerate();
  if (view === 'characters') return renderCharacters();
  if (view === 'backgrounds') return renderBackgrounds();
  if (view === 'episodes') return renderEpisodes();
  if (view === 'play') return renderPlay();
  return renderHome();
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
