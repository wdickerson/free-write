const ws = document.getElementById('workspace');
const blurBtn = document.getElementById('blur-btn');
let blurred = false;

blurBtn.addEventListener('click', blurClick);

function blurClick(e) {
  ws.style.color = 'black';
  ws.style.textShadow = 'none';
  if (!blurred) {
    ws.style.color = 'transparent';
    ws.style.textShadow = '0 0 25px gray';
  } 
  blurred = !blurred;
}