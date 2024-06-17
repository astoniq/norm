import React, {createContext} from "react";

export const TenantContext = createContext<string>("")

export type Props = {
    readonly tenantId: string;
    readonly children?: React.ReactNode;
}

export function TenantProvider({tenantId, children}: Props) {
    return <TenantContext.Provider value={tenantId}>
        {children}
    </TenantContext.Provider>
}