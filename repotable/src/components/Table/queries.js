import gql from 'graphql-tag'

export const repoQuery = gql`
query RepoQuery {
	viewer {
		repositories (first: 10) {
			totalCount
			nodes {
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
	}
}
`