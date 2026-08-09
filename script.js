// Screen Elements References
const newTabScreen = document.getElementById('new-tab-screen');
const webContentScreen = document.getElementById('web-content-screen');
const frameContainer = document.getElementById('frame-container');
const fullAddressBar = document.getElementById('full-address-bar');
const miniAddressDisplay = document.getElementById('mini-address-display');

let currentEngine = 'google'; 

window.onload = () => { 
  goHome(); 
  initClock();
  initMatrixCanvas();
};

// 1. Digital Clock
function initClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById('clock-time').innerText = now.toLocaleTimeString();
  }, 1000);
}

// 2. Matrix Rain Canvas Effect
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = '0123456789NEXUSBROWSER';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent-color').trim() || '#38bdf8';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(draw, 33);
}

// 3. Theme Switcher
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
}

// 4. Voice Search System
function startVoiceSearch() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("Voice Search is not supported in this browser engine.");
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  fullAddressBar.placeholder = "Listening...";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    fullAddressBar.value = transcript;
    navigateToUrl();
  };

  recognition.onerror = () => {
    fullAddressBar.placeholder = "Try typing instead...";
  };
}

// 5. Engine Switcher
function setEngine(engine) {
  currentEngine = engine;
  document.querySelectorAll('.engine-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${engine === 'duckduckgo' ? 'duck' : engine}`).classList.add('active');
}

// 6. Navigation Logic & Command System
function navigateToUrl() {
    let input = fullAddressBar.value.trim();
    if (!input) return;

    if (input.startsWith('/yt ')) {
        loadInIframe(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(input.replace('/yt ', ''))}`);
        return;
    } else if (input.startsWith('/ai')) {
        loadInIframe(`https://chatgpt.com`);
        return;
    } else if (input.startsWith('/map')) {
        loadInIframe(`https://maps.google.com`);
        return;
    }

    let finalUrl = '';
    const isDomain = input.includes('.') && !input.includes(' ');

    if (isDomain) {
        finalUrl = input.startsWith('http') ? input : 'https://' + input;
    } else {
        if (currentEngine === 'google') {
            finalUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(input)}`;
        } else if (currentEngine === 'bing') {
            finalUrl = `https://www.bing.com/search?q=${encodeURIComponent(input)}`;
        } else if (currentEngine === 'duckduckgo') {
            finalUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(input)}`;
        }
    }

    loadInIframe(finalUrl);
}

function loadInIframe(url) {
    newTabScreen.classList.add('hidden');
    frameContainer.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.id = 'active-frame';
    iframe.src = url;
    frameContainer.appendChild(iframe);

    webContentScreen.classList.remove('hidden');
    miniAddressDisplay.value = url;
    fullAddressBar.value = ''; 
}

function quickLoad(url) { loadInIframe(url); }

function handleEnter(e) {
    if (e.key === 'Enter') navigateToUrl();
}

function goHome() {
    webContentScreen.classList.add('hidden');
    frameContainer.innerHTML = '';
    newTabScreen.classList.remove('hidden');
    fullAddressBar.focus();
}

function reloadPage() {
    const activeFrame = document.getElementById('active-frame');
    if (activeFrame) {
        activeFrame.src = activeFrame.src;
    } else {
        location.reload();
    }
}