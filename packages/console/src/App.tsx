import {BrowserRouter} from "react-router-dom";
import {PageContextProvider} from "./providers/PageContextProvider";
import {AppConfirmModalProvider} from "./providers/AppConfirmModalProvider";
import {mainTitle} from "./constants";
import Toast from "./components/Toast";
import ErrorBoundary from "./containers/ErrorBoundary";
import {AppRoutes} from "./containers/AppRoutes";
import {Helmet, HelmetProvider} from "react-helmet-async";

import 'overlayscrollbars/overlayscrollbars.css';
import './styles/undescore.css'
import {initI18n} from "./i18n";

void initI18n();

function App() {

    return (
        <BrowserRouter>
            <HelmetProvider>
                <Helmet titleTemplate={`%s - ${mainTitle}`} defaultTitle={mainTitle}/>
                <Toast/>
                <ErrorBoundary>
                    <PageContextProvider>
                        <AppConfirmModalProvider>
                            <AppRoutes/>
                        </AppConfirmModalProvider>
                    </PageContextProvider>
                </ErrorBoundary>
            </HelmetProvider>
        </BrowserRouter>
    )
}


export default App
