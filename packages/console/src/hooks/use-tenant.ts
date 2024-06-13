import {useContext} from "react";
import {TenantContext} from "../providers/TenantProvider";


export const useTenant = () => useContext(TenantContext);