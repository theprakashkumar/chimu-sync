import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { appConfig } from "./appConfig";
import { NotFoundException } from "../utils/appErrors";
import { ProviderEnum } from "../enums/accountProviderEnum";
import { loginOrCreateAccountService } from "../services/authService";

passport.use(
  new GoogleStrategy(
    {
      clientID: appConfig.GOOGLE_ID,
      clientSecret: appConfig.GOOGLE_SECRET,
      callbackURL: appConfig.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        const { email, sub: googleId, picture } = profile._json;
        if (!googleId) {
          throw new NotFoundException("Google ID is missing!");
        }
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));
