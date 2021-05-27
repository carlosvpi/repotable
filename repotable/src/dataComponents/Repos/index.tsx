import React, { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client/react';
import { useTable, usePagination } from 'react-table'
import { repoQuery } from '../../graphql/queries/repos'
import { Pagination } from '../../components/Pagination'
import { Table } from '../../components/Table'
import { Container } from '../../styledComponents/Container'

interface ReactTableRowType {
  row: {
    original: {
      url: string,
      name: string
    }
  }
}

interface RowType {
  url: string,
  name: string,
  stargazers: countable,
  forks: countable,
  description: string
}

const columns: Array<any> = [{
	Header: 'name',
	Cell: function Cell ({ row }: ReactTableRowType) { return <a target='_black' href={ row.original.url }>{ row.original.name  }</a> }
}, {
	Header: 'Stars',
	accessor: 'stars'
}, {
	Header: 'Forks',
	accessor: 'forks'
}]

interface countable {
  totalCount: number
}

const mockData = {"viewer":{"repositories":{"totalCount":32,"nodes":[{"name":"aleph","description":"Grammar npm module","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/aleph","__typename":"Repository"},{"name":"abjad","description":null,"forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/abjad","__typename":"Repository"},{"name":"beeper","description":null,"forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/beeper","__typename":"Repository"},{"name":"vtr","description":"Small d2 algebra module","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/vtr","__typename":"Repository"},{"name":"futl","description":"Functional library full of utilities","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/futl","__typename":"Repository"},{"name":"neuret","description":null,"forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/neuret","__typename":"Repository"},{"name":"trinity-backend","description":"Spark app as a server","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/trinity-backend","__typename":"Repository"},{"name":"trinity-frontend","description":"Single page application","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/trinity-frontend","__typename":"Repository"},{"name":"ldab-frontend","description":"Front-end for ldab","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/ldab-frontend","__typename":"Repository"},{"name":"ldab-backend","description":"Server for ldab","forks":{"totalCount":0,"__typename":"RepositoryConnection"},"stargazers":{"totalCount":0,"__typename":"StargazerConnection"},"url":"https://github.com/carlosvpi/ldab-backend","__typename":"Repository"}],"__typename":"RepositoryConnection"},"__typename":"User"}}

export const Repotable = () => {
  const [filter, setFilter] = useState('')
	const { data: trueData, loading, error} = useQuery(repoQuery)

  const data = error
    ? mockData
    : trueData

  const nodes = data?.viewer?.repositories?.nodes ?? []
  const filteredNodes = filter
    ? nodes.filter(({ name }: RowType) => !!name.match(filter))
    : nodes
	const tableData = useMemo(() => filteredNodes.map(({ url, name, stargazers, forks, description }: RowType) => ({
		name,
		stars: stargazers?.totalCount ?? 0,
		forks: forks?.totalCount ?? 0,
		url,
		description
	})) ?? [], [data, filter])

  const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageSize, pageIndex },
	} = useTable({
		columns,
		data: tableData,
		initialState: { pageIndex: 0 }
	}, usePagination)

	if (error) {
		console.warn(error)
	}

	if (loading) {
		return <em>Loading</em>
	}

	return <>
    {
      error && <>
        <p>There was an error</p>
        <p>Data below is mock</p>
      </>
    }
    <Container hasShadow>
      <input placeholder='Filter by name' onChange={ ({ target }) => {
        setFilter(target.value)
      } } />
    </Container>
    <Container hasShadow={ false }>
      <Pagination
        gotoPage={ gotoPage }
        canPreviousPage={ canPreviousPage }
        canNextPage={ canNextPage }
        previousPage={ previousPage }
        nextPage={ nextPage }
        pageIndex={ pageIndex }
        pageOptions={ pageOptions }
        pageSize={ pageSize }
        setPageSize={ setPageSize }
        pageCount={ pageCount }
      />
    </Container>
    <Container hasShadow>
      <Table
        tableProps={ getTableProps() }
        headers={ headerGroups.map((headerGroup, i) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={ i }>
            {headerGroup.headers.map((column, i) => (
              <th {...column.getHeaderProps()} key={ i }>{column.render('Header')}</th>
            ))}
          </tr>
        )) }
        tableBodyProps={ getTableBodyProps() }
        rows={ rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} key={ i }>
              {row.cells.map((cell, i) => {
                return <td {...cell.getCellProps()} key={ i }>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        }) }
      />
    </Container>
  </>
}
