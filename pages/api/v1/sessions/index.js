import * as cookie from "cookie";
import controller from "infra/controller";
import authentication from "models/authentication";
import session from "models/session";
import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandles);

async function postHandler(request, response) {
  const userInputValues = request.body;

  const authenticationUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );

  const newSession = await session.create(authenticationUser.id);

  const setCookie = cookie.serialize("session_id", newSession.token, {
    path: "/",
    maxAge: session.EXPIRATION_IN_MILLISECONDS / 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    // sameSite: "Strict",
  });

  response.setHeader("Set-Cookie", setCookie);

  return response.status(201).json(newSession);
}
