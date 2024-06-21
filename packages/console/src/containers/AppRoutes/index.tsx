import {Route, Routes} from "react-router-dom";
import {LoadingLayerProvider} from "../../providers/LoadingLayerProvider";
import {AppLayout} from "../AppLayout";
import {Auth} from "../../pages/Auth";
import {AppContent} from "../AppContent";
import {Projects} from "../../pages/Projects";
import {ProjectContent} from "../ProjectContent";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<LoadingLayerProvider/>}>
                <Route element={<AppLayout/>}>
                    <Route path="auth" element={<Auth/>}/>
                    <Route element={<AppContent/>}>
                        <Route path="projects">
                            <Route index={true} element={<Projects/>}/>
                            <Route path=":projectId/*" element={<ProjectContent/>}/>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}