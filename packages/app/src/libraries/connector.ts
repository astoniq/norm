import {Queries} from "../queries/index.js";
import {Connector, ConnectorFactoryResponse, ConnectorResponse} from "@astoniq/norm-schema";
import {connectorFactories, ConnectorFactory} from "@astoniq/norm-connectors";
import {Optional} from "@astoniq/essentials";

export const createConnectorLibrary = (queries: Queries) => {

    const transpileConnectors = (connectors: readonly Connector[]): ConnectorResponse[] =>
        connectors.reduce((acc, item) => {
            const factory = connectorFactories.find(({name}) => name === item.name)
            if (factory) {
                const {metadata, target, type} = factory
                acc.push({
                    ...item,
                    metadata,
                    target,
                    type
                });
            }
            return acc;
        }, [] as ConnectorResponse[]);

    const transpileConnectorsFactory = (): ConnectorFactoryResponse[] =>
        connectorFactories.map((factory) => transpileConnectorFactory(factory))

    const transpileConnectorFactory = (
        {type, target, name, metadata}: ConnectorFactory): ConnectorFactoryResponse => {
        return {
            type,
            target,
            name,
            metadata
        }
    }

    const findConnectorFactory = (name: string): Optional<ConnectorFactory> =>
        connectorFactories.find((factory) => factory.name === name)

    return {
        queries,
        transpileConnectors,
        findConnectorFactory,
        transpileConnectorsFactory,
        transpileConnectorFactory
    }
}