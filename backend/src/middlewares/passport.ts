import passport from "passport"
import { setupJwtStrategy } from "../config/passportStrategy"

const initializePassport = () => {
  setupJwtStrategy(passport);
}

initializePassport();

export default passport;