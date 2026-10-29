import React, { ReactNode } from 'react';

type FallbackRender = (props: { error: Error }) => React.ReactElement;

interface ErrorBoundaryProps {
    children: ReactNode;
    fallbackrender: FallbackRender;
}

interface ErrorBoundaryState {
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    render() {
        const { error } = this.state;
        const { fallbackrender, children } = this.props;

        if (error) {
            return fallbackrender({ error });
        }

        return children;
    }
}
