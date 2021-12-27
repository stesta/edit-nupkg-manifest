import JSZip from 'jszip'
import {promises as fs} from 'fs'
import convert from 'xml-js'

function getManifestName(zip: JSZip): string {
  let files = zip.file(/.*\.nuspec/)
  return files[0].name
}

export async function getManifestFromPackage(nupkgPath: string): Promise<string> {
  let data = await fs.readFile(nupkgPath)
  let zip = await JSZip.loadAsync(data)
  let nuspec = getManifestName(zip)
  let manifest = await zip.files[nuspec].async('string')

  return manifest
}

export async function getManifestFromFile(nuspecPath: string): Promise<string> {
  let manifest = await fs.readFile(nuspecPath, 'utf-8')

  return manifest
}

export async function updateManifest(nupkgPath: string, xml: string): Promise<void> {
  // update the internal representation
  let data = await fs.readFile(nupkgPath)
  let zip = await JSZip.loadAsync(data)
  let nuspec = getManifestName(zip)
  zip.file(nuspec, xml)

  // write back to file
  let generated = await zip.generateAsync({type: 'nodebuffer'})
  await fs.writeFile(nupkgPath, generated)
}

export function updateXmlNode(metadata: convert.Element[], name: string, text: string): convert.Element[] {
  let field = metadata.find(el => el.name == name)?.elements!?.find(el => el.type == 'text')

  // is there a good pattern matching solution in typescript?
  if (field != undefined) {
    field.text = text
  }
  // if the field doesn't exist then add it
  else {
    metadata.push({
      type: 'element',
      name: name,
      text: text
    })
  }

  return metadata
}

export function addRepositoryXmlNode(metadata: convert.Element[], type: string, url: string): convert.Element[] {
  let field = metadata.find(el => el.name === 'repository')?.attributes

  if (field != undefined) {
    field.type = type
    field.url = url
  } else {
    metadata.push({
      type: 'element',
      name: 'repository',
      attributes: {
        type: type,
        url: url
      }
    })
  }

  return metadata
}
