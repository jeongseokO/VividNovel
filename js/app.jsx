const { useState, useRef } = React;

const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];

function App() {
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [novelText, setNovelText] = useState('');
  const [novelData, setNovelData] = useState(null);
  const [scenes, setScenes] = useState([]);
  const audioRef = useRef(null);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  const handleFile = (e) => setFile(e.target.files[0]);

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
    if (!file) {
      alert('파일을 선택하세요.');
      return;
    }
    const text = await readFile(file);
    setNovelText(text);
    const res = await fetch('data/novel.json');
    const data = await res.json();
    setNovelData(data);
    setStep('setup');
  }

  function handleVoiceChange(idx, voice) {
    setNovelData(prev => ({
      ...prev,
      characters: prev.characters.map((c, i) => i === idx ? { ...c, voice } : c)
    }));
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
        const src = `https://placehold.co/400x300?text=Scene+${idx + 1}`;
        setScenes(prev => [...prev, src]);
        resolve();
      }, 500);
    });
  }

  async function generateAudio(text) {
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
    setStep('play');
    const chunks = chunkText(novelText);
    const preloadCount = Math.min(5, chunks.length);
    for (let i = 0; i < preloadCount; i++) {
      await generateScene(i);
    }
    for (let i = 0; i < chunks.length; i++) {
      setCurrentSceneIdx(i);
      const src = await generateAudio(chunks[i]);
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

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>VividNovel</h1>
      </aside>
      <main className="main">
        {step !== 'play' && (
          <div className="container">
            {step === 'upload' && (
              <div>
                <p>소설 파일(txt, pdf)을 업로드하세요.</p>
                <input type="file" onChange={handleFile} accept=".txt,.text,.pdf" />
                <button onClick={startGenerate}>생성 시작</button>
              </div>
            )}

            {step === 'setup' && novelData && (
              <div>
                <h2>등장인물 &amp; 배경</h2>
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
                <h2>배경</h2>
                <div className="flex">
                  {novelData.backgrounds.map((bg, idx) => (
                    <div className="card" key={idx}>
                      <img src={bg.image} alt={bg.name} />
                      <h3>{bg.name}</h3>
                      <p>{bg.mood}</p>
                    </div>
                  ))}
                </div>
                <button onClick={startPlay}>재생 시작</button>
              </div>
            )}
          </div>
        )}

        {step === 'play' && (
          <div className="scene-wrapper">
            {scenes[currentSceneIdx] && (
              <img
                src={scenes[currentSceneIdx]}
                alt={`Scene ${currentSceneIdx + 1}`}
                className="scene-image"
              />
            )}
            <audio ref={audioRef}></audio>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
