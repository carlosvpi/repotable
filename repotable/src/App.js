import logo from './logo.svg'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { Repotable } from './components/Table'
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
      <div className="App">
        <Repotable repos={[{
          name: 'repotable',
          owner: 'carlosvpi'
        }]}/>
      </div>
    </ApolloProvider>
  )
}

export default App
