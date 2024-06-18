import db from "./db.js";
import tenant from "./tenant.js";
import auth from "./auth.js";
import guard from "./guard.js";

import {Errors} from "../../../types/index.js";

const errors: Errors = {
    db,
    auth,
    guard,
    tenant
};

export default Object.freeze(errors);