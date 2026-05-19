import styled from '@emotion/styled';
import React from 'react';
import { Spin, Typography,Button } from 'antd';
interface RowProps {
    gap?: number | boolean;
    between?: boolean;
    marginBottom?: number;
};

export const Row = styled.div<RowProps>`
    display: flex;
    align-items: center;
    justify-content: ${props => props.between ? 'space-between' : undefined};
    margin-bottom: ${props => props.marginBottom + 'rem'};
    > * {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        margin-right: ${props => typeof props.gap === 'number' ? props.gap + 'rem' : props.gap ? '2rem' : undefined};
    }
`
const FullPage=styled.div`
height:100vh;
display:flex;
justify-content:center;
align-items:center;
`
export const FullPageLoading = () => {
    return React.createElement(
        FullPage,
        null,
        React.createElement(Spin, { size: 'large' })
    )
}

export const FullPageError = ({ error }: { error: Error }) => {
  return React.createElement(
    FullPage,
    null, // 或者传递 props 对象
    React.createElement(
        
      Typography.Text,
      { type: "danger" },
      error.message
    )
  );
};

export const ButtonNoPadding=styled(Button)`
padding:0
`