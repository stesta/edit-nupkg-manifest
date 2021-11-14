import JSZip from 'jszip'
import fs from 'fs'
import convert from 'xml-js'

export function unpack(nupkg: string): string {
    var zip = new JSZip()
    fs.readFile(nupkg, (err, data) => {
        
    })

    return ""
}


export function repack(folder: string): void {

}

export function getManifest(path: string): convert.Element | convert.ElementCompact {
    var xml = fs.readFileSync(path, 'utf-8')
    return convert.xml2js(xml)
}

function updateMetadata(metadata: convert.Element[], name: string, text: string): convert.Element[] {
    var field = metadata
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

function addRepositoryMetadata(metadata: convert.Element[], type: string, url: string): convert.Element[] {
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

export function updateManifest(manifest: convert.Element | convert.ElementCompact): convert.Element | convert.ElementCompact {
    var metadata: convert.Element[] = manifest.elements[0].elements[0].elements

    metadata = updateMetadata(metadata, "version", "0.2.0")
    metadata = addRepositoryMetadata(metadata, "git", "https://github.com/stesta/repo")

    return manifest;
}