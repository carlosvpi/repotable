import React, { useState, useMemo } from 'react'
import { useQuery } from '@apollo/client/react';
import { useTable, usePagination } from 'react-table'
import { repoQuery } from './queries'

interface RowProps2 {
  row: {
    original: {
      url: string,
      name: string
    }
  }
}

const columns: Array<Column> = [{
	Header: 'name',
	Cell: ({ row }) => <a target='_black' href={ row.original.url }>{ row.original.name  }</a>
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

	// @ts-ignore
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
		<table {...getTableProps()}>
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
    </table>
    <div className="pagination">
      <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
        {'<<'}
      </button>{' '}
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'<'}
      </button>{' '}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        {'>'}
      </button>{' '}
      <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
        {'>>'}
      </button>{' '}
      <span>
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>
      <span>
        | Go to page:{' '}
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={e => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0
            gotoPage(page)
          }}
          style={{ width: '100px' }}
        />
      </span>{' '}
      <select
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  </>
}

// Repotable.propTypes