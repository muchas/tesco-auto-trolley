import * as $ from 'jquery';

$(function() {
  console.log('started');
  const $token = $('#todoist-token');
  const $project = $('#todoist-project');

  chrome.storage.sync.get('todoist_token', (item) => $token.val(item.todoist_token))
  chrome.storage.sync.get('todoist_project', (item) => $project.val(item.todoist_project));

  $('#save').click(() => {
    const token = (<string>$token.val());
    const projectName = (<string>$project.val());

    chrome.storage.sync.set({'todoist_token': token, 'todoist_project': projectName});
  });
});
