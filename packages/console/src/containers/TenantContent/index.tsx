import {useParams, useRoutes} from "react-router-dom";
import {TenantProvider} from "../../providers/TenantProvider";
import {useEffect, useState} from "react";
import {useTenantRoutes} from "../../hooks/use-tenant-routes.tsx";

export function TenantContent() {

    const {tenantId} = useParams<{tenantId: string}>()

    const [currentTenantId, setCurrentTenantId] = useState(tenantId ?? '');

    useEffect(() => {
        setCurrentTenantId(tenantId ?? '')
    }, [tenantId])

    const tenantRoutes = useTenantRoutes()

    const routes = useRoutes(tenantRoutes);

    return (
        <TenantProvider tenantId={currentTenantId}>
            <div>tenant</div>
            {routes}
        </TenantProvider>
    )
}