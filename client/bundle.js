/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);