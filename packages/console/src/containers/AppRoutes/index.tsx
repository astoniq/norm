import {Route, Routes} from "react-router-dom";
import {LoadingLayerProvider} from "../../providers/LoadingLayerProvider";
import {AppLayout} from "../AppLayout";
import {Auth} from "../../pages/Auth";
import {AppContent} from "../AppContent";
import {Tenants} from "../../pages/Tenants";
import {TenantContent} from "../TenantContent";
import {Dashboard} from "../../pages/Dashboard";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<LoadingLayerProvider/>}>
                <Route element={<AppLayout/>}>
                    <Route path="auth" element={<Auth/>}/>
                    <Route element={<AppContent/>}>
                        <Route path="tenants">
                            <Route index={true} element={<Tenants/>}/>
                            <Route path=":tenantId" element={<TenantContent/>}>
                                <Route index={true} element={<Dashboard/>}/>
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}