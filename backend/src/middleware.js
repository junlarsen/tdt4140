export function withAuth(userService) {
  return async (req, res, next) => {
    const authorization = req.headers["authorization"];
    if (typeof authorization !== "string") {
      return res.sendStatus(401);
    }
    try {
      const token = authorization.substring(6);
      const user = await userService.decrypt(token);
      if (user === null) {
        return res.sendStatus(403);
      }
      req.user = user;
    } catch (err) {
      return res.sendStatus(500);
    }

    next();
  };
}

export function adminOnly(req, res, next) {
  if (req.user.user_role !== "a") {
    return res.sendStatus(403);
  }
  next();
}
