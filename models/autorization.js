function can(user, features) {
  let authorized = false;

  if (user.features.includes(features)) {
    authorized = true;
  }

  return authorized;
}

const autorization = {
  can,
};

export default autorization;
