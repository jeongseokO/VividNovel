const btn = document.getElementById('loginBtn');
const input = document.getElementById('username');

btn.addEventListener('click', () => {
  const name = input.value.trim();
  if (!name) {
    alert('이름을 입력하세요');
    return;
  }
  localStorage.setItem('username', name);
  location.href = 'index.html';
});
