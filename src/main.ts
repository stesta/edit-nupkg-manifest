import * as core from '@actions/core'
import * as utils from './nupkg-utils'
import convert from 'xml-js'

async function run(): Promise<void> {
  try {
    const nupkgPath: string = core.getInput('nupkg-path')
    const version: string = core.getInput('version')

      let folder = await utils.unpack(nupkgPath);
      let manifest = await utils.getManifest(folder);

      let metadata: convert.Element[] = manifest.elements[0].elements[0].elements // todo: get these elements in a better way
      utils.updateMetadata(metadata, "version", "0.2.0")
      utils.addRepositoryMetadata(metadata, "git", "https://github.com/stesta/repo")

      await utils.repack(folder, manifest);

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
