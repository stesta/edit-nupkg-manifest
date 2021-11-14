import JSZip from 'jszip'
import fs from 'fs'
import convert from 'xml-js'
import * as _ from 'lodash/fp'

export function unpack(nupkg: string): string {
    var zip = new JSZip()
    fs.readFile(nupkg, (err, data) => {
        
    })

    return ""
}


export function repack(folder: string): void {

}

export function getManifest(folder: string): string {
    return folder + "/.nuspec"
}

export function updateManifest(xml: string): string {
    var js = convert.xml2js(xml);

    var metadata: convert.Element[] = js.elements[0].elements[0].elements;
    console.log(metadata);

    var version: convert.Element = _.flow([
        _.find((o: convert.Element) => o.name === "version"),
        _.property('elements'),
        _.find((o: convert.Element) => o.type == "text")
    ])(metadata)

    metadata.push({
        type: 'element',
        name: 'repository',
        attributes: {
            type: 'git',
            url: 'https://github.com/stesta/repo'
        }
    })

    version.text = "0.2.0"

    return convert.js2xml(js);
}