import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import fs from 'fs/promises'
import convert from 'xml-js'
import {updateXmlNode, addRepositoryXmlNode} from '../src/nupkg-utils'

test('get manifest directly from zip', async () => {
  let data = await fs.readFile('./__tests__/test.nuspec', 'utf-8')
  let manifest = convert.xml2js(data)
  let metadata: convert.Element[] = manifest.elements[0].elements[0].elements // todo: get these elements in a better way

  let original = JSON.stringify(manifest)
  updateXmlNode(metadata, 'version', '0.2.0')
  addRepositoryXmlNode(metadata, 'git', 'https://github.com/stesta/repo')
  let updated = JSON.stringify(manifest)

  expect(updated).not.toBe(original)
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_NUPKGPATH'] = './__tests__/test.nupkg'
  process.env['INPUT_NUSPECNAME'] = 'test.nuspec'
  process.env['INPUT_VERSION'] = '0.2.0'
  process.env['INPUT_REPOSITORYURL'] = 'https://github.com/stesta/repo'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  //console.log(cp.execFileSync(np, [ip], options).toString())
  //cp.execFileSync(np, [ip], options)
})
