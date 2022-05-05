/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: "AutoAttend-App",
  productName: "AutoAttend",
  copyright: "Copyright © 2022 ${author}",
  asar: true,
  directories: {
    output: "release/${version}",
    buildResources: "resources",
  },
  files: ["dist"],
  win: {
    target: [
      {
        //target: "nsis",
        target: "portable",
        arch: ["x64"],
      },
    ],
    //artifactName: "${productName}-${version}-Setup.${ext}",
    artifactName: "AutoAttend.${ext}",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    artifactName: "${productName}-${version}-Installer.${ext}",
  },
  linux: {
    target: ["AppImage"],
    artifactName: "${productName}-${version}-Installer.${ext}",
  },
}
