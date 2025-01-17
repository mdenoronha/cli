import {showEnv} from './show.js'
import {fetchOrgAndApps, fetchOrganizations} from '../../dev/fetch.js'
import {fetchAppFromConfigOrSelect} from '../fetch-app-from-config-or-select.js'
import {AppInterface} from '../../../models/app/app.js'
import {selectOrganizationPrompt} from '../../../prompts/dev.js'
import {testApp, testOrganizationApp} from '../../../models/app/app.test-data.js'
import {describe, expect, vi, test} from 'vitest'
import {ensureAuthenticatedPartners} from '@shopify/cli-kit/node/session'
import * as file from '@shopify/cli-kit/node/fs'
import {joinPath} from '@shopify/cli-kit/node/path'
import {stringifyMessage, unstyled} from '@shopify/cli-kit/node/output'

vi.mock('../../dev/fetch.js')
vi.mock('../fetch-app-from-config-or-select.js')
vi.mock('../../../prompts/dev.js')
vi.mock('@shopify/cli-kit/node/session')
vi.mock('@shopify/cli-kit/node/node-package-manager')

describe('env show', () => {
  test('outputs the new environment', async () => {
    // Given
    vi.spyOn(file, 'writeFile')

    const app = mockApp()
    const token = 'token'
    const organization = {
      id: '123',
      betas: {},
      businessName: 'test',
      website: '',
      apps: {nodes: []},
    }
    const organizationApp = testOrganizationApp()

    vi.mocked(fetchOrganizations).mockResolvedValue([organization])
    vi.mocked(selectOrganizationPrompt).mockResolvedValue(organization)
    vi.mocked(fetchOrgAndApps).mockResolvedValue({
      organization,
      stores: [],
      apps: {nodes: [organizationApp], pageInfo: {hasNextPage: false}},
    })
    vi.mocked(fetchAppFromConfigOrSelect).mockResolvedValue(organizationApp)
    vi.mocked(ensureAuthenticatedPartners).mockResolvedValue(token)

    // When
    const result = await showEnv(app)

    // Then
    expect(file.writeFile).not.toHaveBeenCalled()
    expect(unstyled(stringifyMessage(result))).toMatchInlineSnapshot(`
    "
        SHOPIFY_API_KEY=api-key
        SHOPIFY_API_SECRET=api-secret
        SCOPES=my-scope
      "
    `)
  })
})

function mockApp(currentVersion = '2.2.2'): AppInterface {
  const nodeDependencies: {[key: string]: string} = {}
  nodeDependencies['@shopify/cli'] = currentVersion
  return testApp({
    name: 'myapp',
    directory: '/',
    configurationPath: joinPath('/', 'shopify.app.toml'),
    configuration: {
      scopes: 'my-scope',
    },
    nodeDependencies,
  })
}
