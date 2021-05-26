import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client/react';
import { useTable, usePagination } from 'react-table'
import { repoQuery } from '../../graphql/queries/repos'
import { Pagination } from '../../components/Pagination'
import { Table } from '../../components/Table'

interface RowProps {
  row: {
    original: {
      url: string,
      name: string
    }
  }
}

const columns: Array<any> = [{
	Header: 'name',
	Cell: function Cell ({ row }: RowProps) { return <a target='_black' href={ row.original.url }>{ row.original.name  }</a> }
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

export const Repotable = () => {
	const { data, loading, error} = useQuery(repoQuery)

	const tableData = useMemo(() => data?.viewer?.repositories?.nodes?.map?.(({ url, name, stargazers, forks, description }: { url: string, name: string, stargazers: countable, forks: countable, description: string }) => ({
		name,
		stars: stargazers?.totalCount ?? 0,
		forks: forks?.totalCount ?? 0,
		url,
		description
	})) ?? [], [data])

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
		return <strong>{ JSON.stringify(error) }</strong>
	}

	if (loading) {
		return <em>Loading</em>
	}

	return <>
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
  </>
}

// Repotable.propTypes