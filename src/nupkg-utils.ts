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

    //var version = _.flow([
    //    _.filter((o: convert.Element) => o.name == ""),
    //    _.head
    //])(js.elements)

    var version = _.filter((o: convert.Element) => o.name == "")(js)

    console.log(js.elements)
    console.log(version)

    return convert.js2xml(js);
}