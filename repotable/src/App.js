import React from 'react'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Repotable } from './dataComponents/Repos'
import { StyledApp } from './styledComponents/StyledApp'
import './App.css'

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: 'https://api.github.com/graphql' })),
  cache: new InMemoryCache()
})

const token = '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'


function App() {
  return (
    <ApolloProvider client={ client }>
      <StyledApp>
        <Repotable repos={[{
          name: 'repotable',
          owner: 'carlosvpi'
        }]}/>
      </StyledApp>
    </ApolloProvider>
  )
}

export default App
