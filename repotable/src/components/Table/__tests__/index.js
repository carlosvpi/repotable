import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from '@apollo/client/testing'
import { Repotable } from '../'
import { repoQuery } from '../queries' 

const mocks = [
  {
    request: { query: repoQuery },
    result: [
      {
        data: {
          viewer: {
            repositories: {
              totalCount: 2,
              nodes: [
                {
                  name: 'repo 1',
                  description: 'description 1',
                  forks: { totalCount: 1 },
                  stargazers: { totalCount: 5 },
                  url: 'url 1'
                },
                {
                  name: 'repo 2',
                  description: 'description 2',
                  forks: { totalCount: 3 },
                  stargazers: { totalCount: 0 },
                  url: 'url 2'
                }
              ]
            }
          }
        }
      }
    ]
  }
]

test('Repotable matches snapshot', async () => {
  const component = renderer.create(<MockedProvider mocks={ mocks }>
    <Repotable />
  </MockedProvider>)
  expect(component.toJSON().children).toContain('Loading')
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(component.toJSON()).toMatchSnapshot()
})