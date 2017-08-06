webpackJsonp([1],{

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const $ = __webpack_require__(0);
$(function () {
    console.log('started');
    const $token = $('#todoist-token');
    const $project = $('#todoist-project');
    chrome.storage.sync.get('todoist_token', (item) => $token.val(item.todoist_token));
    chrome.storage.sync.get('todoist_project', (item) => $project.val(item.todoist_project));
    $('#save').click(() => {
        const token = $token.val();
        const projectName = $project.val();
        console.log('saving token and project...' + token + ' ' + projectName);
        chrome.storage.sync.set({ 'todoist_token': token, 'todoist_project': projectName });
    });
});


/***/ })

},[4]);