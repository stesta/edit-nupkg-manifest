import * as core from '@actions/core'
import * as utils from './nupkg-utils'
import convert from 'xml-js'
import {promises as fs} from 'fs'

async function run(): Promise<void> {
  try {
    // input variables from action
    const nupkgPath = core.getInput('nupkgPath')
    const nuspecPath = core.getInput('nuspecPath')
    const id = core.getInput('id')
    const title = core.getInput('title')
    const description = core.getInput('description')
    const version = core.getInput('version')
    const authors = core.getInput('authors')
    const owners = core.getInput('owners')
    const repo = core.getInput('repositoryUrl')

    // read the manifest
    let data = (typeof nuspecPath != 'undefined' && nuspecPath) 
      ? (await fs.readFile(nuspecPath)).toString()
      : await utils.getManifestFromPackage(nupkgPath)
    let manifest = convert.xml2js(data)

    // get the manifest metadata
    // todo: get these elements in a better way
    let metadata: convert.Element[] = manifest.elements[0].elements[0].elements 
    
    // update metadata
    if (typeof id != 'undefined' && id) { utils.updateXmlNode(metadata, 'id', id) }
    if (typeof title != 'undefined' && title) { utils.updateXmlNode(metadata, 'title', title) }
    if (typeof description != 'undefined' && description) { utils.updateXmlNode(metadata, 'description', description) }
    if (typeof version != 'undefined' && version) { utils.updateXmlNode(metadata, 'version', version) }
    if (typeof authors != 'undefined' && authors) { utils.updateXmlNode(metadata, 'authors', authors) }
    if (typeof owners != 'undefined' && owners) { utils.updateXmlNode(metadata, 'owners', owners) }
    if (typeof repo != 'undefined' && repo) { utils.addRepositoryXmlNode(metadata, 'git', repo) }

    // write the updated manifest to the package
    await utils.updateManifest(nupkgPath, convert.js2xml(manifest))
  } 
  catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
