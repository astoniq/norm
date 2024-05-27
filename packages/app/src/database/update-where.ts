import {CommonQueryMethods, sql} from "slonik";
import {notFalsy, Truthy} from "@astoniq/essentials";
import {Entity, EntityGuard, EntityLike, EntityValue, UpdateWhereData} from "../types/index.js";
import {conditionalSql, convertToIdentifiers, convertToPrimitiveOrSql} from "../utils/sql.js";
import {isKeyOf} from "../utils/entity.js";
import {UpdateError} from "../errors/index.js";
import assertThat from "../utils/assert-that.js";

type BuildUpdateWhere = {
    <T extends EntityLike<T>>
    (entity: Entity<T>, guard: EntityGuard<T>, returning: true): (data: UpdateWhereData<T, T>) => Promise<T>;
    <T extends EntityLike<T>>
    (entity: Entity<T>, guard: EntityGuard<T>, returning?: false): (data: UpdateWhereData<T, T>) => Promise<void>;
}

export const buildUpdateWhereWithPool =
    (pool: CommonQueryMethods): BuildUpdateWhere =>
        <T extends EntityLike<T>>
        (
            entity: Entity<T>,
            guard: EntityGuard<T>,
            returning = false
        ) => {
            const {fields, table} = convertToIdentifiers(entity);
            const isKeyOfSchema = isKeyOf(entity);

            const connectKeyValueWithEqualSign = <T>(data: Partial<EntityLike<T>>, jsonbMode: 'replace' | 'merge') =>
                Object.entries<EntityValue>(data)
                    .map(([key, value]) => {
                        if (!isKeyOfSchema(key) || value === undefined) {
                            return;
                        }

                        if (
                            jsonbMode === 'merge' &&
                            value &&
                            typeof value === 'object' &&
                            !Array.isArray(value)
                        ) {
                            /**
                             * Jsonb || operator is used to shallow merge two jsonb types of data
                             * all jsonb data field must be non-nullable
                             * https://www.postgresql.org/docs/current/functions-json.html
                             */
                            return sql.fragment`
                            ${fields[key]}=coalesce(${fields[key]},'{}'::jsonb) || ${convertToPrimitiveOrSql(key, value)}`;
                        }

                        return sql.fragment`${fields[key]}=${convertToPrimitiveOrSql(key, value)}`
                    })
                    .filter((value): value is Truthy<typeof value> => notFalsy(value));

            return async ({set, where, jsonbMode}: UpdateWhereData<T, T>): Promise<T | void> => {
                const query = sql.fragment`
                    update ${table}
                    set ${sql.join(connectKeyValueWithEqualSign(set, jsonbMode), sql.fragment`, `)}
                    where ${sql.join(connectKeyValueWithEqualSign(where, jsonbMode), sql.fragment` and `)} ${conditionalSql(returning, () => sql.fragment`returning *`)}
                `;

                const {
                    rows: [data]
                } = returning
                    ? await pool.query(sql.type(guard)`${query}`)
                    : await pool.query(sql.unsafe`${query}`);

                assertThat(!returning || data, new UpdateError(entity, {set, where}));

                return data;
            }
        }
