const electronPackager = require('electron-packager')
const createDMG = require('electron-installer-dmg')
const installerLinux = require('electron-installer-debian')
const package = require('./package.json')

const MSICreator = require('electron-wix-msi')

var args = process.argv

async function windows () {
  console.log('🏢 Generating .exe..')
  const appPath = await electronPackager({platform: 'win32', dir: './', out: './dist/apps', overwrite: true, icon: './assets/icons/256x256.ico'})
  console.log('🏗️  Creating setup from .exe (this may take a while).')
  
  // Step 1: Instantiate the MSICreator
  const msiCreator = new MSICreator({
    appDirectory: appPath,
    description: package.description,
    exe: package.name,
    name: package.name,
    manufacturer: package.autor,
    version: package.version,
    outputDirectory: './dist/installers'
  })

  // Step 2: Create a .wxs template file
  await msiCreator.create()

  // Step 3: Compile the template to a .msi file
  await msiCreator.compile()
}

async function macos () {
  console.log('\n🏢 Generating .app..')
  await electronPackager({ platform: 'darwin', dir: './', out: './dist/apps', overwrite: true, icon: './assets/icons/256x256.icns' })
  console.log('🏗️  Creating dmg from .app (this may take a while).')
  await createDMG({appPath: './dist/apps/notifier-darwin-x64/notifier.app', out: './dist/installers', name: 'notifier', overwrite: true }).then(() => {
    console.log(`🙌 Successfully created macos package at dist/installers.`)
  })
}

async function linux () {
  console.log('\n🏢 Generating the executable for linux..')
  var arch
  args.forEach(element => {
    if (element.indexOf('--arch=') !== 0) arch = element.split('--arch=')
  })
  if (!arch) {
    console.log('❌ The arch argument was not found. Please provide it when you want to build for linux.')
    process.exit(1)
  }
  await electronPackager({ platform: 'linux', dir: './', out: './dist/apps', overwrite: true, icon: './assets/icons/256x256.png' })
  console.log('⚠️ The following process may not succeed due to not having the requirements. Ignore the errors, if you don\'t want a .deb installer.')
  console.log('🏗️  Creating .deb from the linux app (this may take a while).')
    
  try {
    await installerLinux({ src: './dist/apps/notifier-linux-x64', dest: './dist/installers', arch: arch })
    console.log(`🙌 Successfully created linux package at dist/installers.`)
  } catch (err) {
    console.error(err, err.stack)
    process.exit(1)
  }
}

async function main () {
  if (args.includes('--windows')) await windows()
  if (args.includes('--macos')) await macos()
  if (args.includes('--linux')) await linux()

  console.log('\n🎉 Built all packages!')
}

main()