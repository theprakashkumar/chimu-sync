import SessionModel from "../models/sessionModel"
import { NotFoundException } from "../utils/appErrors";

const getAllSessionService = async (userId: string) => {
  const sessions = await SessionModel.find({
    userId,
    expiredAt: { $gt: Date.now() }
  }, {
    _id: 1,
    userId: 1,
    userAgent: 1,
    createAte: 1,
    expiredAt: 1
  },
    {
      sort: {
        createdAt: -1
      }
    }
  );

  return sessions;
}

const getCurrentSessionService = async (sessionId: string) => {
  const session = await SessionModel.findById(sessionId)
    .populate("userId")
    .select("-expiresAt");

  if (!session) {
    throw new NotFoundException("Session not found!");
  }
  const { userId: user } = session
  return user;
}

export { getAllSessionService, getCurrentSessionService }