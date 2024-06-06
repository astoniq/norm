import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PageContextProvider} from "./providers/PageContextProvider";
import {LoadingLayerProvider} from "./providers/LoadingLayerProvider";
import {NotFound} from "./pages/NotFound";
import {AppLayout} from "./containers/AppLayout";

import './styles/undescore.css'

function App() {

    return (
        <BrowserRouter>
            <PageContextProvider>
                <Routes>
                    <Route element={<LoadingLayerProvider/>}>
                        <Route element={<AppLayout/>}>
                            <Route path="*" element={<NotFound/>}/>
                        </Route>
                    </Route>
                </Routes>
            </PageContextProvider>
        </BrowserRouter>
    )
}

export default App
