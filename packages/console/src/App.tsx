import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PageContextProvider} from "./providers/PageContextProvider";
import {LoadingLayerProvider} from "./providers/LoadingLayerProvider";
import {NotFound} from "./pages/NotFound";
import {AppLayout} from "./containers/AppLayout";
import {AppConfirmModalProvider} from "./providers/AppConfirmModalProvider";

import './styles/undescore.css'
import {TenantProvider} from "./providers/TenantProvider";
import {Test} from "./pages/Test";

function App() {

    return (
        <BrowserRouter>
            <PageContextProvider>
                <AppConfirmModalProvider>
                    <TenantProvider>
                        <Routes>
                            <Route element={<LoadingLayerProvider/>}>
                                <Route element={<AppLayout/>}>
                                    <Route path="/tenant/1" element={<Test/>}/>
                                    <Route path="*" element={<NotFound/>}/>
                                </Route>
                            </Route>
                        </Routes>
                    </TenantProvider>
                </AppConfirmModalProvider>
            </PageContextProvider>
        </BrowserRouter>
    )
}

export default App
