import User from "../../modules/User/User.entity";

import * as LocalStrategy from "passport-local";
import UserService from "../../modules/User/User.service";

export default new LocalStrategy(
    {
        usernameField: "email",
    },
    async (email: string, password: string, done) => {
        try {
            // find user with email
            const userService = new UserService();
            const user: User = await userService.findByEmailWithPassword(email);
            if (user) {
                // if found, check if password matches
                const check = await user.checkPassword(password);
                if (check) {
                    // correct email and password combination. Pass user to request
                    const user: User = await userService.findOneBy({
                        email: email,
                    });
                    return done(null, user);
                }
            }
            // not allowed! wrong email and password combination
            return done(null, null);
        } catch (e) {
            return done(e, null);
        }
    }
);
