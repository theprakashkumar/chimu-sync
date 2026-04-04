import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { UnauthorizedException } from "../utils/appErrors";
import { appConfig } from "./appConfig";
import passport, { PassportStatic } from "passport";
import UserModel from "../models/userModel";

interface JwtPayload {
  userId: string;
  sessionId: string
}

const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      const accessToken = req.cookie.accessToken;
      if (!accessToken) {
        throw new UnauthorizedException()
      }
      return accessToken
    }
  ]),
  secretOrKey: appConfig.JWT_SECRET,
  audience: ["user"],
  algorithms: ["HS256"],
  passReqToCallback: true,
};

export const setupJwtStrategy = (passport: PassportStatic) => {
  passport.use(new Strategy(options, async (req, payload: JwtPayload, done) => {
    try {
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return done(null, false);
      }
      req.sessionId = payload.sessionId;
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
};

export const authenticatedJwt = passport.authenticate("jwt", { session: false });