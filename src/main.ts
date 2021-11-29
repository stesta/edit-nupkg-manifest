import * as core from '@actions/core'
import * as utils from './nupkg-utils'
import convert from 'xml-js'

async function run(): Promise<void> {
  try {
    // input variables from action
    const nupkgPath: string = core.getInput('nupkgPath')
    const nuspecName: string = core.getInput('nuspecName')
    const version: string = core.getInput('version')
    const repo: string = core.getInput('repositoryUrl')

    // read the manifest from the package
    let data = await utils.getManifest(nupkgPath, nuspecName)
    let manifest = convert.xml2js(data)

    // update the manifest metadata
    let metadata: convert.Element[] = manifest.elements[0].elements[0].elements // todo: get these elements in a better way
    utils.updateXmlNode(metadata, 'version', version)
    utils.addRepositoryXmlNode(metadata, 'git', repo)

    // write the updated manifest to the package
    await utils.updateManifest(nupkgPath, nuspecName, convert.js2xml(manifest))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
