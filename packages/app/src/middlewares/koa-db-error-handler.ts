import {Middleware} from "koa";
import {
    CheckIntegrityConstraintViolationError,
    ForeignKeyIntegrityConstraintViolationError,
    InvalidInputError,
    NotFoundError,
    SlonikError,
    UniqueIntegrityConstraintViolationError
} from "slonik";
import {
    DeletionError,
    InsertionError,
    RequestError,
    UpdateError
} from "../errors/index.js";

export default function koaDbErrorHandler<StateT, ContextT>(): Middleware<StateT, ContextT> {
    return async (_, next) => {
        try {
            await next();
        } catch (error) {
            if (!(error instanceof SlonikError)) {
                throw error;
            }

            if (error instanceof InvalidInputError) {
                throw new RequestError({
                    code: 'db.invalid_input',
                    status: 400
                })
            }

            if (error instanceof UniqueIntegrityConstraintViolationError) {
                throw new RequestError({
                    code: 'db.unique_integrity_violation',
                    status: 400
                })
            }

            if (error instanceof ForeignKeyIntegrityConstraintViolationError) {
                throw new RequestError({
                    code: 'db.relation_foreign_key_not_found',
                    status: 400
                })
            }

            if (error instanceof CheckIntegrityConstraintViolationError) {
                throw new RequestError({
                    code: 'db.db_constraint_violated',
                    status: 400
                })
            }

            if (error instanceof InsertionError) {
                throw new RequestError({
                    code: 'db.create_failed',
                    status: 400
                })
            }

            if (error instanceof UpdateError) {
                throw new RequestError({
                    code: 'db.not_exists',
                    status: 400
                })
            }

            if (error instanceof DeletionError || error instanceof NotFoundError) {
                throw new RequestError({
                    code: 'db.not_found',
                    status: 400
                })
            }

            throw error;
        }
    }
}