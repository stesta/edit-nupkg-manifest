import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import {promises as fs} from 'fs'
import convert from 'xml-js'
import {getManifestFromPackage, updateXmlNode, addRepositoryXmlNode, updateManifest, getManifestFromFile} from '../src/nupkg-utils'

test('get manifest from zip', async () => {
  let data = await getManifestFromPackage('./__tests__/test.nupkg')
  let manifest = convert.xml2js(data)
  let metadata: convert.Element[] = manifest.elements[0].elements[0].elements // todo: get these elements in a better way

  let field = metadata.find(el => el.name == 'id')?.elements!?.find(el => el.type == 'text')

  expect(field).toStrictEqual({text: 'Test', type: 'text'})
})

test('can update a manifest', async () => {
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
test('test run with default nuspec', () => {
  process.env['INPUT_NUPKGPATH'] = './__tests__/test.nupkg'
  process.env['INPUT_NUSPECPATH'] = './__tests__/test.nuspec'
  process.env['INPUT_VERSION'] = '0.2.0'
  process.env['INPUT_REPOSITORYURL'] = 'https://github.com/stesta/edit-nupkg-manifest'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  cp.execFileSync(np, [ip], options)
})

test('test run without default nuspec', () => {
  process.env['INPUT_NUPKGPATH'] = './__tests__/test.nupkg'
  process.env['INPUT_VERSION'] = '1.0.0'
  process.env['INPUT_REPOSITORYURL'] = 'https://github.com/stesta/edit-nupkg-manifest'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  cp.execFileSync(np, [ip], options)
})
