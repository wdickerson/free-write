const xhr = require('xhr');
const ws = document.getElementById('workspace');
const blurBtn = document.getElementById('blur-btn');
const storiesList = document.getElementById('stories-list');
const userHeader = document.getElementById('user-header');
const displayName = document.getElementById('display-name');
const guestHeader = document.getElementById('guest-header');

let blurred = false;
blurBtn.addEventListener('click', () => {
  ws.style.color = blurred ? 'black' : 'transparent';
  ws.style.textShadow = blurred ? 'none' : '0 0 25px gray';
  blurred = !blurred;
});

xhr({
  uri: '/get-stories',
  json: true,
}, (err, resp, body) => {
  body.forEach(s => {
    const newItem = document.createElement('a');
    newItem.innerHTML = s.name;
    newItem.className = 'dropdown-item';
    newItem.addEventListener('click', () => ws.value = s.text);
    storiesList.appendChild(newItem);
  });  
});

xhr({
    uri: '/authenticate',
    json: true,
}, (err, resp, body) => {
    if (body.isUser) {
      userHeader.style.display = 'block';
      displayName.innerHTML = body.name;
    } else {
      guestHeader.style.display = 'block';
    }
})
