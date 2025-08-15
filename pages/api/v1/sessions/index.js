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

  controller.setSessionCookie(newSession.token, response);

  return response.status(201).json(newSession);
}
