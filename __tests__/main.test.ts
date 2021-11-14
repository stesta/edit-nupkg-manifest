import {updateManifest} from '../src/nupkg-utils'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

test('update manifest version', () => {
    var xml = '<?xml version="1.0"?><package xmlns="http://schemas.microsoft.com/packaging/2010/07/nuspec.xsd"><metadata><id>HylandCheckout.Web</id><title>Hyland Checkout</title><version>$version$</version><authors>Hyland Ecosystem Team</authors><owners>Hyland Ecosystem Team</owners><description>The Hyland Checkout web application</description><repository type="git" url="https://github.com/HylandEcosystem/HylandCheckout"/></metadata></package>'

    var updated = updateManifest(xml);

    expect(updated).toBe(xml);
})

// shows how the runner will run a javascript action with env / stdout protocol
//test('test runs', () => {
//  process.env['INPUT_VERSION'] = '0.1.0'
//  const np = process.execPath
//  const ip = path.join(__dirname, '..', 'lib', 'main.js')
//  const options: cp.ExecFileSyncOptions = {
//    env: process.env
//  }
//  console.log(cp.execFileSync(np, [ip], options).toString())
//})
