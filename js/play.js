const startBtn = document.getElementById('startBtn');
const sceneSection = document.getElementById('sceneSection');
const audioPlayer = document.getElementById('audioPlayer');

const novelText = localStorage.getItem('novelText') || '';
const novelData = JSON.parse(localStorage.getItem('novelData') || '{"characters":[]}');

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
      const img = document.createElement('img');
      img.src = `https://placehold.co/400x300?text=Scene+${idx + 1}`;
      img.alt = `Scene ${idx + 1}`;
      sceneSection.appendChild(img);
      resolve();
    }, 500);
  });
}

async function generateAudio(text) {
  const voices = {};
  novelData.characters.forEach(c => {
    voices[c.name] = c.voice;
  });
  const res = await fetch('/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      script: `나레이션: ${text}`,
      voices
    })
  });
  const data = await res.json();
  return `data:audio/wav;base64,${data.audio}`;
}

startBtn.addEventListener('click', async () => {
  const chunks = chunkText(novelText);
  const preloadCount = Math.min(5, chunks.length);
  for (let i = 0; i < preloadCount; i++) {
    generateScene(i);
  }
  for (let i = 0; i < chunks.length; i++) {
    const src = await generateAudio(chunks[i]);
    audioPlayer.src = src;
    audioPlayer.play();
    const nextSceneIdx = i + preloadCount;
    if (nextSceneIdx < chunks.length) {
      generateScene(nextSceneIdx);
    }
    await new Promise(res => (audioPlayer.onended = res));
  }
});
