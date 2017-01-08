const ws = document.getElementById('workspace');
const blurBtn = document.getElementById('blur-btn');
const storiesList = document.getElementById('stories-list');
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

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  let myStories = [];
  if (this.readyState == 4 && this.status == 200) {
    myStories = JSON.parse(this.responseText);
  }
  
  myStories.forEach(s => {
    var newItem = document.createElement('a');
    newItem.innerHTML = s.name;
    newItem.className = 'dropdown-item';
    newItem.setAttribute('href', '#');
    newItem.addEventListener('click', () => {
      ws.value = s.text;
    })
    storiesList.appendChild(newItem);
  });
};

xhttp.open("GET", "/api/get-stories", true);
xhttp.send();
