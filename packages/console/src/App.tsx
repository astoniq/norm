import {BrowserRouter} from "react-router-dom";
import {PageContextProvider} from "./providers/PageContextProvider";
import {AppConfirmModalProvider} from "./providers/AppConfirmModalProvider";
import {TenantProvider} from "./providers/TenantProvider";
import {Helmet} from "react-helmet";
import {mainTitle} from "./constants";
import Toast from "./components/Toast";
import ErrorBoundary from "./containers/ErrorBoundary";
import {AppRoutes} from "./containers/AppRoutes";

import './styles/undescore.css'


function App() {

    return (
        <BrowserRouter>
            <Helmet titleTemplate={`%s - ${mainTitle}`} defaultTitle={mainTitle}/>
            <Toast/>
            <ErrorBoundary>
                <PageContextProvider>
                    <AppConfirmModalProvider>
                        <TenantProvider>
                            <AppRoutes/>
                        </TenantProvider>
                    </AppConfirmModalProvider>
                </PageContextProvider>
            </ErrorBoundary>
        </BrowserRouter>
    )
}


export default App
