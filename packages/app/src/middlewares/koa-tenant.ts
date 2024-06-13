import {IRouterParamContext} from "koa-router";
import {Tenant} from "@astoniq/norm-schema";
import {Middleware} from "koa";
import {Queries} from "../queries/index.js";
import assertThat from "../utils/assert-that.js";
import {RequestError} from "../errors/index.js";
import {tenantIdHeaderKey} from "@astoniq/norm-schema";

export type WithTenantContext<ContextT extends IRouterParamContext = IRouterParamContext> =
    ContextT & { tenant: Tenant }

export default function koaTenant<
    StateT,
    ContextT extends IRouterParamContext,
    ResponseBodyT
>({
      tenants
  }: Queries): Middleware<StateT, WithTenantContext<ContextT>, ResponseBodyT> {

    return async (ctx, next) => {

        const tenantId = ctx.get(tenantIdHeaderKey);

        assertThat(tenantId,
            new RequestError({code: 'tenant.id_header_missing', status: 400}))

        const tenant = await tenants.findTenantById(tenantId)

        assertThat(tenant,
            new RequestError({code: 'tenant.id_not_found', status: 400}))

        ctx.tenant = tenant;

        return next();
    }
}

