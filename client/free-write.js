const xhr = require('xhr');
const wsTitle = document.getElementById('workspace-title');
const ws = document.getElementById('workspace');
const blurBtn = document.getElementById('blur-btn');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');
const newStoryBtn = document.getElementById('new-story-btn');
const storiesList = document.getElementById('stories-list');
const userHeader = document.getElementById('user-header');
const displayName = document.getElementById('display-name');
const guestHeader = document.getElementById('guest-header');

let currentStory = {};
let stories = [];

let blurred = false;
blurBtn.addEventListener('click', () => {
  ws.style.color = blurred ? 'black' : 'transparent';
  ws.style.textShadow = blurred ? 'none' : '0 0 25px gray';
  blurred = !blurred;
});

saveBtn.addEventListener('click', saveStory);
deleteBtn.addEventListener('click', deleteStory);

newStoryBtn.addEventListener('click', () => {
  ws.value = '';
  wsTitle.value = '';
  currentStory = {};
});

function loadStory(story) {
  currentStory = story;
  wsTitle.value = story.title;
  ws.value = story.text;
}

function saveStory() {
  currentStory.title = wsTitle.value;
  currentStory.text = ws.value;
  
  xhr({
    uri: '/save-story',
    method: 'post',
    json: true,
    body: currentStory,
  }, (err, resp, body) => {
    if (currentStory._id == null && body != null) {
      currentStory._id = body;
      stories.push(currentStory);
    }
    populateStoriesList();
  });
}

function deleteStory() {
  ws.value = '';
  wsTitle.value = '';
  
  if (currentStory._id != null) {
    xhr({
      uri: '/delete-story',
      method: 'post',
      json: true,
      body: { _id: currentStory._id },
    }, (err, resp, body) => {
      stories = stories.filter(s => s._id !== currentStory._id);
      currentStory = {};
      populateStoriesList();
    });
  }
}

function populateStoriesList(newList = false) {
  if (newList) stories = newList;
  storiesList.innerHTML = '';
  stories.sort((a, b) => a.title.localeCompare(b.title));
  stories.forEach(s => {
    const newItem = document.createElement('a');
    newItem.innerHTML = s.title;
    newItem.className = 'dropdown-item';
    newItem.addEventListener('click', () => loadStory(s));
    storiesList.appendChild(newItem);
  });  
}

const json = { json: true };
xhr.get('/get-user-stories', json, (err, resp, body) => populateStoriesList(body));


xhr.get('/authenticate', json, (err, resp, body) => {
  displayName.innerHTML = body.name;
  if (body.isUser) userHeader.style.display = 'block';
  else guestHeader.style.display = 'block';
})
