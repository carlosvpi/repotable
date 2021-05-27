import styled from 'styled-components'

export const Container = styled.div<{ hasShadow: boolean }>`
	margin-bottom: 15px;
	margin-top: 15px;
	box-shadow: ${props => props.hasShadow ? '0px 0px 10px gray' : ''};
`