import {getManifest, updateManifest, updateXmlNode, addRepositoryXmlNode} from '../src/nupkg-utils'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import { expect, test } from '@jest/globals'
import convert from 'xml-js'

test('get manifest directly from zip', async () => {
    let data = await getManifest("./__tests__/HylandCheckout.Web.0.1.0.nupkg", "HylandCheckout.Web.nuspec")
    let manifest = convert.xml2js(data)
    let before = JSON.stringify(manifest)

    let metadata: convert.Element[] = manifest.elements[0].elements[0].elements // todo: get these elements in a better way
    updateXmlNode(metadata, "version", "0.2.0")
    addRepositoryXmlNode(metadata, "git", "https://github.com/stesta/repo")
    let after = JSON.stringify(manifest)

    await updateManifest("./__tests__/HylandCheckout.Web.0.1.0.nupkg", "HylandCheckout.Web.nuspec", convert.js2xml(manifest))

    expect(before).not.toBe(after)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_NUPKGPATH'] = './__tests__/HylandCheckout.Web.0.1.0.nupkg'
    process.env['INPUT_NUSPECNAME'] = 'HylandCheckout.Web.nuspec'
    process.env['INPUT_VERSION'] = '0.2.0'
    process.env['INPUT_REPOSITORYURL'] = 'https://github.com/stesta/repo'

    const np = process.execPath
    const ip = path.join(__dirname, '..', 'lib', 'main.js')
    const options: cp.ExecFileSyncOptions = {
        env: process.env
    }

    //console.log(cp.execFileSync(np, [ip], options).toString())
    cp.execFileSync(np, [ip], options)
})
