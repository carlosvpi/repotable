import React, { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client/react';
import { useTable, usePagination } from 'react-table'
import { repoQuery } from './queries'
import { Pagination } from '../Pagination'
import { Table } from '../../styledComponents/Table'

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
	Cell: ({ row }: RowProps) => <a target='_black' href={ row.original.url }>{ row.original.name  }</a>
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
	const [pageIndex, setPageIndex] = useState(0)
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
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageSize },
	} = useTable({
		columns,
		data: tableData,
		initialState: { pageIndex }
	}, usePagination)

	if (error) {
		return <strong>{ JSON.stringify(error) }</strong>
	}

	if (loading) {
		return <em>Loading</em>
	}

	return <>
		<Table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
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