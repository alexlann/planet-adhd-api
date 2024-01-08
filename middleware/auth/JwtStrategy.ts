import { ExtractJwt, Strategy } from "passport-jwt";
import UserService from "../../modules/User/User.service";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

export default new Strategy(jwtOptions, async (payload: ExtractJwt, done: ExtractJwt) => {
    try {
        const { email, id } = payload;

        // check if user with id and email exists
        const userService = new UserService();
        const user = await userService.findOneBy({ email, id });

        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});
