import application from "./application.js";
import entity from "./entity.js";
import guard from "./guard.js";
import auth from "./auth.js";
import session from "./session.js";
import user from "./user.js";
import verification_code from "./verification-code.js";
import {Errors} from "../../../types.js";

const errors: Errors = {
    application,
    guard,
    auth,
    entity,
    verification_code,
    session,
    user
};

export default Object.freeze(errors);