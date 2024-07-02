import {Queries} from "../queries/index.js";
import {Connector, ConnectorFactoryResponse, ConnectorResponse} from "@astoniq/norm-schema";
import {connectorFactories, ConnectorFactory} from "@astoniq/norm-connectors";
import {Optional} from "@astoniq/essentials";

export const createConnectorLibrary = (queries: Queries) => {

    const transpileConnector = (connector: Connector, {
        metadata,
        description,
        target,
        type
    }: ConnectorFactory): ConnectorResponse =>
        ({
            ...connector,
            metadata,
            description,
            target,
            type
        })

    const transpileConnectors = (connectors: readonly Connector[]): ConnectorResponse[] =>
        connectors.reduce((acc, item) => {
            const factory = connectorFactories.find(({name}) => name === item.name)
            if (factory) {
                acc.push(transpileConnector(item, factory));
            }
            return acc;
        }, [] as ConnectorResponse[]);

    const transpileConnectorsFactory = (): ConnectorFactoryResponse[] =>
        connectorFactories.map((factory) => transpileConnectorFactory(factory))

    const transpileConnectorFactory = (
        {type, target, name, metadata, description}: ConnectorFactory): ConnectorFactoryResponse => {
        return {
            type,
            target,
            description,
            name,
            metadata
        }
    }

    const findConnectorFactory = (name: string): Optional<ConnectorFactory> =>
        connectorFactories.find((factory) => factory.name === name)

    return {
        queries,
        transpileConnectors,
        transpileConnector,
        findConnectorFactory,
        transpileConnectorsFactory,
        transpileConnectorFactory
    }
}