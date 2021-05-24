import gql from 'graphql-tag'

export const repoQuery = gql`
query RepoQuery ($name: String!, $owner: String!) {
	repository(name: $name, owner: $owner) {
		name
		description
		forks {
			totalCount
		}
		stargazers {
			totalCount
		}
		url
	}
}
`