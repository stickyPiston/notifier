const { ipcRenderer, remote } = require('electron')

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault()
  var target = e.target
  ipcRenderer.send('formSubmitted', { time: target.querySelector('input[type=number]').value * 60 * 1000, title: target.querySelector('input#title').value, body: target.querySelector('input#body').value })
  var window = remote.getCurrentWindow()
  window.hide()
  Array.from(e.target.querySelectorAll('input:not([type="submit"])')).forEach(element => {
    element.value = ''
  })
  document.querySelector('form > input').focus()
})

ipcRenderer.on('notify', (_e, arg) => {
  new Notification(arg.title, {body: arg.body})
})

Array.from(document.querySelectorAll('form input:not([type=submit])')).forEach(element => {
  element.addEventListener('blur', (e) => {
    target =  e.target
    parent = target.parentElement
    if (target.required && target.value != '') {
      parent.classList.remove('invalid')
      parent.classList.add('valid')
    } else if (target.required && target.value == '') {
      parent.classList.remove('valid')
      parent.classList.add('invalid')
    }
  })
})