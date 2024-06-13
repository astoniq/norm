import type { ReactNode } from 'react';
import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {TFunction} from "i18next";
import {AppError} from "../../components/AppError";

type Props = {
    readonly children: ReactNode;
    readonly t: TFunction<'translation', 'console'>;
};

type State = {
    error?: Error;
};

class ErrorBoundary extends Component<Props, State> {
    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    public state: State = {};

    render() {
        const { children} = this.props;
        const { error } = this.state;

        if (!error) {
            return children;
        }

        return <AppError errorMessage={error.message}  />;
    }
}

export default withTranslation('translation', { keyPrefix: 'admin_console' })(ErrorBoundary);