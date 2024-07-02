import {ConnectorError, ConnectorErrorCodes} from "@astoniq/norm-connectors";
import {RequestError} from "../errors/index.js";
import {trySafe} from "@astoniq/essentials";
import {Middleware} from "koa";
import {z} from "zod";

export default function koaConnectorErrorHandler<StateT, ContextT>(): Middleware<StateT, ContextT> {

    return async (_, next) => {
        try {
            await next();
        } catch (error: unknown) {
            if (!(error instanceof ConnectorError)) {
                throw error;
            }

            const { code, data } = error;

            const errorDescriptionGuard = z.object({ errorDescription: z.string() });
            const message =
                trySafe(() => errorDescriptionGuard.parse(data))?.errorDescription ?? JSON.stringify(data);

            switch (code) {
                case ConnectorErrorCodes.InvalidMetadata:
                case ConnectorErrorCodes.InvalidConfigGuard:
                case ConnectorErrorCodes.InvalidRequestParameters:
                case ConnectorErrorCodes.InsufficientRequestParameters:
                case ConnectorErrorCodes.InvalidConfig:
                case ConnectorErrorCodes.InvalidCertificate:
                case ConnectorErrorCodes.InvalidResponse: {
                    throw new RequestError({ code: `connector.${code}`, status: 400 }, data);
                }

                default: {
                    throw new RequestError(
                        {
                            code: `connector.${code}`,
                            status: 400,
                            errorDescription: message,
                        },
                        data
                    );
                }
            }
        }
    };
}