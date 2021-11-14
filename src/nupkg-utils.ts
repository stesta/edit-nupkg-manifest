import JSZip from 'jszip'
import fs from 'fs/promises'
import convert from 'xml-js'

export async function unpack(nupkg: string): Promise<string> {
    var pkg = await fs.readFile(nupkg)

    let folder = "" // generate guid as folder name so it is unique
    let zip = new JSZip()
    // unzip pkg to folder

    return folder
}

export async function repack(folder: string, manifest: convert.Element | convert.ElementCompact): Promise<void> {
    // convert.js2xml(manifest) -> overwrite .nuspec
    // zip folder -> overwrite .nupkg
}

export async function getManifest(path: string): Promise<convert.Element | convert.ElementCompact> {
    let manifest = await fs.readFile(path, 'utf-8')
    return convert.xml2js(manifest)
}

export function updateMetadata(metadata: convert.Element[], name: string, text: string): convert.Element[] {
    let field = metadata
        .find(el => el.name == name)
        ?.elements!
        ?.find(el => el.type == "text")

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

export function addRepositoryMetadata(metadata: convert.Element[], type: string, url: string): convert.Element[] {
    metadata.push({
        type: 'element',
        name: 'repository',
        attributes: {
            type: type,
            url: url
        }
    })

    return metadata
}
