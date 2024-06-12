import application from "./application.js";
import db from "./db.js";
import guard from "./guard.js";
import auth from "./auth.js";
import session from "./session.js";
import user from "./user.js";
import {Errors} from "../../../types.js";

const errors: Errors = {
    application,
    guard,
    auth,
    db,
    session,
    user
};

export default Object.freeze(errors);