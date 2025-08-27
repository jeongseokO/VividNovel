const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');

analyzeBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('파일을 선택하세요.');
    return;
  }
  const text = await readFile(file);
  localStorage.setItem('novelText', text);
  const res = await fetch('data/novel.json');
  const novelData = await res.json();
  localStorage.setItem('novelData', JSON.stringify(novelData));
  location.href = 'characters.html';
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
  }
  return await file.text();
}

// 드래그 앤 드롭 업로드 지원
document.addEventListener('dragover', e => {
  e.preventDefault();
});

document.addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
  }
});
