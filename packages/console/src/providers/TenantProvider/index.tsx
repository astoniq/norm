import {Tenant} from "@astoniq/norm-schema";
import React, {createContext, useCallback, useMemo, useState} from "react";
import {noop} from "@astoniq/essentials";
import {useMatch, useNavigate} from "react-router-dom";

export type TenantContextType = {
    tenants: Tenant[];
    currentTenantId: string;
    navigateTenant: (tenantId: string) => void;
    isInitComplete: boolean;
    resetTenants: (tenants: Tenant[]) => void;
    prependTenant: (tenant: Tenant) => void;
    removeTenant: (tenantId: string) => void;
    updateTenant: (tenantId: string, data: Partial<Tenant>) => void;
}

export const TenantContext = createContext<TenantContextType>({
    tenants: [],
    isInitComplete: false,
    resetTenants: noop,
    prependTenant: noop,
    removeTenant: noop,
    updateTenant: noop,
    currentTenantId: '',
    navigateTenant: noop
})

export type Props = {
    readonly children?: React.ReactNode;
}

export function TenantProvider({children}: Props) {
    const [tenants, setTenants] = useState<Tenant[]>([]);

    const [isInitComplete, setIsInitComplete] = useState(false);

    const match = useMatch('/tenant/:tenantId/*');
    const navigate = useNavigate();

    const currentTenantId = useMemo(() => {
        if (!match) {
            return ''
        }
        return match.params.tenantId ?? ''
    }, [match]);

    const navigateTenant = useCallback(
        (tenantId: string) => {
            navigate(`/tenant/${tenantId}`);
        },
        [navigate]
    );

    const currentTenant = useMemo(
        () => tenants.find((tenant) => tenant.id === currentTenantId),
        [currentTenantId, tenants]
    );

    const memorizedContext = useMemo(
        () => ({
            tenants,
            resetTenants: (tenants: Tenant[]) => {
                setTenants(tenants);
                setIsInitComplete(true);
            },
            prependTenant: (tenant: Tenant) => {
                setTenants((tenants) => [tenant, ...tenants]);
            },
            removeTenant: (tenantId: string) => {
                setTenants((tenants) => tenants.filter((tenant) => tenant.id !== tenantId));
            },
            updateTenant: (tenantId: string, data: Partial<Tenant>) => {
                setTenants((tenants) =>
                    tenants.map((tenant) => (tenant.id === tenantId ? {...tenant, ...data} : tenant))
                );
            },
            isInitComplete,
            currentTenantId,
            currentTenant,
            navigateTenant,
        }),
        [currentTenant, currentTenantId, isInitComplete, navigateTenant, tenants]
    );

    return <TenantContext.Provider value={memorizedContext}>{children}</TenantContext.Provider>
}