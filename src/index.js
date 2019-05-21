setInterval(() => {
  let myNotification = new Notification('20 Minutes have passed!', {
    body: 'And the timer has reset itself.'
  })
}, 1200000)