import db from "./db.js";
import project from "./project.js";
import auth from "./auth.js";
import guard from "./guard.js";
import connector from "./connector.js";

import {Errors} from "../../../types/index.js";

const errors: Errors = {
    db,
    auth,
    connector,
    guard,
    project
};

export default Object.freeze(errors);