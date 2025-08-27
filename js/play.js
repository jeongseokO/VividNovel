const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pauseBtn = document.getElementById('pauseBtn');
const sceneSection = document.getElementById('sceneSection');
const audioPlayer = document.getElementById('audioPlayer');

const novelText = localStorage.getItem('novelText') || '';
const novelData = JSON.parse(localStorage.getItem('novelData') || '{"characters":[]}');

let chunks = [];
let currentIdx = 0;
const audioCache = [];
const sceneCache = [];

function chunkText(text, size = 300) {
  const chunks = [];
  let idx = 0;
  while (idx < text.length) {
    chunks.push(text.slice(idx, idx + size));
    idx += size;
  }
  return chunks;
}

function showScene(idx) {
  sceneSection.innerHTML = '';
  const img = document.createElement('img');
  img.src = sceneCache[idx] || `https://placehold.co/400x300?text=Scene+${idx + 1}`;
  img.alt = `Scene ${idx + 1}`;
  sceneCache[idx] = img.src;
  sceneSection.appendChild(img);
}

async function generateAudio(text) {
  const voices = {};
  novelData.characters.forEach(c => {
    voices[c.name] = c.voice;
  });
  const res = await fetch('/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script: `나레이션: ${text}`, voices })
  });
  const data = await res.json();
  return `data:audio/wav;base64,${data.audio}`;
}

async function playIdx(idx) {
  currentIdx = idx;
  showScene(idx);
  if (!audioCache[idx]) {
    audioCache[idx] = await generateAudio(chunks[idx]);
  }
  audioPlayer.src = audioCache[idx];
  audioPlayer.play();
}

startBtn.addEventListener('click', () => {
  chunks = chunkText(novelText);
  if (chunks.length) {
    playIdx(0);
  }
});

prevBtn.addEventListener('click', () => {
  if (currentIdx > 0) {
    playIdx(currentIdx - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIdx < chunks.length - 1) {
    playIdx(currentIdx + 1);
  }
});

pauseBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    pauseBtn.textContent = '일시정지';
  } else {
    audioPlayer.pause();
    pauseBtn.textContent = '재생';
  }
});
