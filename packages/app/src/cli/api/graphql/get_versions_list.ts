import {gql} from 'graphql-request'

export const AppVersionsQuery = gql`
  query AppVersionsQuery($apiKey: String!) {
    app(apiKey: $apiKey) {
      id
      organizationId
      title
      appVersions {
        nodes {
          createdAt
          distributionPercentage
          createdBy {
            displayName
          }
          label
          message
          status
          versionTag
        }
        pageInfo {
          totalResults
        }
      }
    }
  }
`

export interface AppVersionsQuerySchema {
  app: {
    id: string
    organizationId: string
    title: string
    appVersions: {
      nodes: {
        createdAt: string
        distributionPercentage: number
        createdBy?: {
          displayName?: string
        }
        label: string
        message?: string
        status: string
        versionTag: string
      }[]
      pageInfo: {
        totalResults: number
      }
    }
  }
}
