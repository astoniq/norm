import {Outlet, useParams} from "react-router-dom";
import {TenantProvider} from "../../providers/TenantProvider";
import {useEffect, useState} from "react";

type TenantParams = {
    tenantId: string
}

export function TenantContent() {
    const {tenantId} = useParams<TenantParams>()

    const [currentTenantId, setCurrentTenantId] = useState(tenantId ?? '');

    useEffect(() => {
        setCurrentTenantId(tenantId ?? '')
    }, [tenantId])

    return (
            <TenantProvider tenantId={currentTenantId}>
                <div>tenant</div>
                <Outlet/>
            </TenantProvider>
    )
}