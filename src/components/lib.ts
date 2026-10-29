import styled from '@emotion/styled';
import React from 'react';
import { Spin, Typography,Button, TypographyProps } from 'antd';

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

const FullPage = styled.div`
height:100vh;
display:flex;
justify-content:center;
align-items:center;
`

const isError = (value: unknown): value is Error => value instanceof Error || !!(value as { message?: unknown })?.message

export const FullPageLoading = () => {
    return React.createElement(
        FullPage,
        null,
        React.createElement(Spin, { size: 'large' })
    )
}

export const FullPageError = ({ error }: { error: unknown }) => {
    if (!isError(error)) {
        return null
    }

    return React.createElement(
        FullPage,
        null,
        React.createElement(
            Typography.Text,
            { type: 'danger' },
            error.message
        )
    )
}

export const ErrorBox = ({ error }: { error: unknown }) => {
    if (!isError(error)) {
        return null
    }

    return React.createElement(
        Typography.Text,
        { type: 'danger' },
        error.message
    )
}

export const ButtonNoPadding = styled(Button)`
padding:0
`

export const ScreenContainer = styled.div`
    padding:3.2rem;
    width:100%;
    display:flex;
    flex-direction:column;
    flex:1;
    height:100%;
    min-height:0;
`;
