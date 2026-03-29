import { v4 as uuidv4 } from "uuid";

const generateInviteCode = () => {
  return uuidv4().replace(/-/g, "").substring(0, 8);
}

const generateTaskCode = () => {
  return `task-${uuidv4().replace(/-/g, "").substring(0, 3)}`;
}

const generateVerificationCode = () => {
  return uuidv4().replace(/-g/, "").substring(0, 25);
}

export { generateInviteCode, generateTaskCode, generateVerificationCode }