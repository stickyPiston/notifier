const { ipcRenderer, remote } = require('electron')

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()
  var target = e.target, when, action, actionValue;
  // 'When' handler
  Array.from(document.querySelectorAll('.col1 > div > input[type=checkbox]')).forEach(element => {if (element.checked) when = element.value});
  // 'action' handler
  Array.from(document.querySelectorAll('.col2 > div > input[type=checkbox]')).forEach(element => { element.value = element.value; if (element.checked) { action = element.value; actionValue = document.querySelector('#' + element.value).value; console.log(element) } });
  
  ipcRenderer.send('formSubmitted', { time: document.querySelector('input#' + when).value * 60 * 1000, when: when, action: action, actionValue: actionValue })
  var window = remote.getCurrentWindow()
  //window.hide()
  Array.from(e.target.querySelectorAll('input:not([type="submit"]):not([type="checkbox"])')).forEach(element => {
    element.value = ''
  })
  document.querySelector('form > input').focus()
})

Array.from(document.querySelectorAll('div.container > div > div > input[type=checkbox]')).forEach(element => {
  element.addEventListener('change', e => {
    console.log(e.target.parentElement.className);
    
    e.target.parentElement.className = e.target.checked ? 'enabled' : 'disabled'
  })
})