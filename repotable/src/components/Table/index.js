import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client/react';
import { useTable } from 'react-table'
import { repoQuery } from './queries'
// import PropTypes from 'proptypes'

const columns = [{
	Header: 'name',
	Cell: ({ row }) => (console.log(row.original), <a target='_black' href={ row.original.url }>{ row.original.name  }</a>)
}, {
	Header: 'Stars',
	accessor: 'stars'
}, {
	Header: 'Forks',
	accessor: 'forks'
}]

export const Repotable = ({ repos }) => {
	const { data, loading, error} = useQuery(repoQuery, { variables: repos[0] })

	const tableData = [
		{
			name: data?.repository?.name ?? '',
			stars: data?.repository?.stargazers?.totalCount ?? 0,
			forks: data?.repository?.forks?.totalCount ?? 0,
			url: data?.repository?.url ?? '',
			description: data?.repository?.description ?? ''
		}
	]

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow
	} = useTable({
		columns,
		data: tableData
	})

	if (error) {
		return <strong>{ error }</strong>
	}

	if (loading) {
		return <em>Loading</em>
	}


	return <table {...getTableProps()}>
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
}

// Repotable.propTypes