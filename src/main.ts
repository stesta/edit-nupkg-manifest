import * as core from '@actions/core'
import * as utils from './nupkg-utils'
import convert from 'xml-js'

async function run(): Promise<void> {
  try {
    const nupkgPath: string = core.getInput('nupkg-path')
    const version: string = core.getInput('version')

      var folder = utils.unpack(nupkgPath);
      var manifest = utils.getManifest(folder);

      var js = convert.xml2js(manifest);
      

      utils.updateManifest(convert.js2xml(js));
      utils.repack(folder);

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
