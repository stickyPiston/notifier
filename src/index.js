const { ipcRenderer, remote } = require('electron')

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()
  var target = e.target, action;
  Array.from(document.querySelectorAll('.col1 > div > input[type=checkbox]')).forEach(element => {if (element.checked) action = element});
  console.log(action.value)
  ipcRenderer.send('formSubmitted', { time: document.querySelector('input#every').value * 60 * 1000, title: document.querySelector('input#title').value, action: action.value })
  var window = remote.getCurrentWindow()
  //window.hide()
  Array.from(e.target.querySelectorAll('input:not([type="submit"])')).forEach(element => {
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