import {Route, Routes} from "react-router-dom";
import {LoadingLayerProvider} from "../../providers/LoadingLayerProvider";
import {AppLayout} from "../AppLayout";
import {Test} from "../../pages/Test";
import {Auth} from "../../pages/Auth";
import {AppContent} from "../AppContent";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<LoadingLayerProvider/>}>
                <Route element={<AppLayout/>}>
                    <Route path="/auth" element={<Auth/>}/>
                    <Route element={<AppContent/>}>
                        <Route path="/tenant/:tenantId" element={<Test/>}/>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}