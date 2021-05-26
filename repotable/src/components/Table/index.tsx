import React from 'react'
import PropTypes from 'prop-types'
import { Table as StyledTable } from '../../styledComponents/Table'

interface TableProps {
  tableProps: object,
  headers: Array<object>,
  tableBodyProps: object,
  rows: Array<object>
}

export const Table: React.FC<TableProps> = ({
  tableProps,
  headers,
  tableBodyProps,
  rows
}) => {
	return <StyledTable {...tableProps}>
    <thead>
      {headers}
    </thead>
    <tbody {...tableBodyProps}>
      {rows}
    </tbody>
  </StyledTable>
}

Table.propTypes = {
  tableProps: PropTypes.object.isRequired,
  headers: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  tableBodyProps: PropTypes.object.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
}