const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const characterSection = document.getElementById('characterSection');
const backgroundSection = document.getElementById('backgroundSection');
const startBtn = document.getElementById('startBtn');
const sceneSection = document.getElementById('sceneSection');

let novelText = '';
let novelData = { characters: [], backgrounds: [] };
let scenes = [];

processBtn.addEventListener('click', async () => {
  if (!fileInput.files[0]) {
    alert('파일을 선택하세요.');
    return;
  }
  novelText = await readFile(fileInput.files[0]);
  novelData = extractNovelData(novelText);
  renderData();
});

async function readFile(file) {
  if (file.type === 'application/pdf') {
    const array = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: array }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  } else {
    return await file.text();
  }
}

function extractNovelData(text) {
  return {
    characters: [
      {
        name: 'Alice',
        appearance: '짧은 머리에 빨간 망토',
        personality: '호기심 많고 용감함',
        voice: '',
        profileImage: 'https://placehold.co/150x150?text=Alice'
      },
      {
        name: 'Bob',
        appearance: '안경 쓴 키 큰 남자',
        personality: '신중하지만 친절함',
        voice: '',
        profileImage: 'https://placehold.co/150x150?text=Bob'
      }
    ],
    backgrounds: [
      {
        name: '마법의 숲',
        mood: '신비롭고 몽환적',
        image: 'https://placehold.co/300x200?text=Forest'
      }
    ]
  };
}

function renderData() {
  characterSection.innerHTML = '';
  const voices = speechSynthesis.getVoices();
  novelData.characters.forEach((ch, idx) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${ch.profileImage}" alt="${ch.name}" />
      <strong>${ch.name}</strong>
      <p>${ch.appearance}</p>
      <p>${ch.personality}</p>
      <label>Voice:
        <select id="voice-${idx}"></select>
      </label>`;
    characterSection.appendChild(div);
    const select = div.querySelector('select');
    voices.forEach(v => {
      const option = document.createElement('option');
      option.value = v.name;
      option.textContent = `${v.name} (${v.lang})`;
      select.appendChild(option);
    });
    select.addEventListener('change', e => (ch.voice = e.target.value));
  });

  backgroundSection.innerHTML = '';
  novelData.backgrounds.forEach(bg => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${bg.image}" alt="${bg.name}" />
      <strong>${bg.name}</strong>
      <p>${bg.mood}</p>`;
    backgroundSection.appendChild(div);
  });
}

speechSynthesis.addEventListener('voiceschanged', renderData);

startBtn.addEventListener('click', () => {
  if (!novelText) {
    alert('먼저 소설을 분석하세요.');
    return;
  }
  startPresentation();
});

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
      scenes[idx] = `https://placehold.co/400x300?text=Scene+${idx + 1}`;
      renderScene(idx);
      resolve();
    }, 1000);
  });
}

function renderScene(idx) {
  const img = document.createElement('img');
  img.src = scenes[idx];
  img.alt = `Scene ${idx + 1}`;
  sceneSection.appendChild(img);
}

function speakText(text, voiceName) {
  return new Promise(resolve => {
    const utter = new SpeechSynthesisUtterance(text);
    const voice = speechSynthesis.getVoices().find(v => v.name === voiceName);
    if (voice) utter.voice = voice;
    utter.onend = resolve;
    speechSynthesis.speak(utter);
  });
}

async function startPresentation() {
  sceneSection.innerHTML = '';
  const chunks = chunkText(novelText);
  scenes = new Array(chunks.length);
  const preloadCount = Math.min(5, chunks.length);
  for (let i = 0; i < preloadCount; i++) {
    await generateScene(i);
  }
  for (let i = 0; i < chunks.length; i++) {
    const chVoice = novelData.characters[0]?.voice;
    const speaking = speakText(chunks[i], chVoice);
    const nextSceneIdx = i + preloadCount;
    if (nextSceneIdx < chunks.length) {
      generateScene(nextSceneIdx);
    }
    await speaking;
  }
}
