const voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];

const characterList = document.getElementById('characterList');
const backgroundList = document.getElementById('backgroundList');
const nextBtn = document.getElementById('nextBtn');

let novelData = JSON.parse(localStorage.getItem('novelData') || '{"characters":[],"backgrounds":[]}');

function render() {
  characterList.innerHTML = '';
  novelData.characters.forEach((ch, idx) => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${ch.profileImage}" alt="${ch.name}" />
      <h3>${ch.name}</h3>
      <p>${ch.appearance}</p>
      <p>${ch.personality}</p>
      <label>Voice:
        <select data-idx="${idx}">
          ${voiceOptions.map(v => `<option value="${v}" ${v===ch.voice?'selected':''}>${v}</option>`).join('')}
        </select>
      </label>
    `;
    characterList.appendChild(div);
  });

  backgroundList.innerHTML = '';
  novelData.backgrounds.forEach(bg => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${bg.image}" alt="${bg.name}" />
      <h3>${bg.name}</h3>
      <p>${bg.mood}</p>
    `;
    backgroundList.appendChild(div);
  });
}

characterList.addEventListener('change', e => {
  if (e.target.tagName === 'SELECT') {
    const idx = e.target.dataset.idx;
    novelData.characters[idx].voice = e.target.value;
  }
});

nextBtn.addEventListener('click', () => {
  localStorage.setItem('novelData', JSON.stringify(novelData));
  location.href = 'play.html';
});

render();
