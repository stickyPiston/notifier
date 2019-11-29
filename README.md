 <p align="left"><img src="assets/icons/horizontal.png" alt="notifier" height="90px"></p>
 
 ![build](https://img.shields.io/azure-devops/build/stickyPiston/27fa1423-88db-4996-afc5-05bf0041062b/1.svg?logo=azuredevops)
 [![Codacy Badge](https://api.codacy.com/project/badge/Grade/b4e0f7b577f04f25a3bcce4dbfc7b176)](https://app.codacy.com/app/stickyPiston/notifier?utm_source=github.com&utm_medium=referral&utm_content=stickyPiston/notifier&utm_campaign=Badge_Grade_Dashboard) [![Greenkeeper badge](https://badges.greenkeeper.io/stickyPiston/notifier.svg)](https://greenkeeper.io/)

🔔 An application that reminds you of things.

* * *

## 💻 How does the app work?
It is very simple. In your tray, on Mac at the top right and on windows at the bottom right, an icon like the icon at the top of this file shows up. If you click it, a menu appears. Hit "_Add a timer_" to create a new timer. Fill in all the information required and click submit. You have successfully created a timer.

If you want to delete a timer. Click the icon again and hit the name of the timer that you want to delete. Hit "Quit notifier" to stop all timers and the application itself.

🚨 The notifications do not work on Windows machines! See the note at [Build from source](#%EF%B8%8F-build-form-source)

* * *

## ☝️ Any improvements or bugs found?
Be sure to create a new issue for this repository when you find a bug, suggestion or anything equivalent to that. Any suggestions are welcome!

* * *

## 🏗️ Build form source
To build this project from source use the following code:
```bash
git clone https://github.com/stickyPiston/notifier.git && cd notifier
npm install
npm start
```

**Note:** On windows machines the notifications won't work when you build the project from source. To fix this add `node_modules/electron/dist/electron.exe` to your start menu. For more information about this, take a look at the [documentation](https://electronjs.org/docs/tutorial/notifications#windows).

* * *
## 📃 License
This repository is licensed under the Unlicense license. See the LICENSE file.
