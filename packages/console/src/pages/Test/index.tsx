import {useTenant} from "../../hooks/use-tenant.ts";

export const Test = () => {

    const {currentTenantId} = useTenant()

    return (
        <div>{currentTenantId}</div>
    )
}