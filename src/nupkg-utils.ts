import JSZip from 'jszip'
import fs from 'fs/promises'
import convert from 'xml-js'

export async function getManifest(nupkgPath: string, nuspecName: string): Promise<string> {
    var data = await fs.readFile(nupkgPath)
    var zip = await JSZip.loadAsync(data)
    var manifest = await zip.files[nuspecName].async("string")

    return manifest
}

export async function updateManifest(nupkgPath: string, nuspecName: string, xml: string): Promise<void> {
    var data = await fs.readFile(nupkgPath)
    var zip = await JSZip.loadAsync(data)
    zip.file(nuspecName, xml);
}

export function updateXmlNode(metadata: convert.Element[], name: string, text: string): convert.Element[] {
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

export function addRepositoryXmlNode(metadata: convert.Element[], type: string, url: string): convert.Element[] {
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