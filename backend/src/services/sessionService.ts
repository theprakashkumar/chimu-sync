import SessionModel from "../models/sessionModel"

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

  return { sessions };
}

export { getAllSessionService }