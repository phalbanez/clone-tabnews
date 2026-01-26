function can(user, feature, resource) {
  let authorized = false;

  if (user.features.includes(feature)) {
    authorized = true;
  }

  if (feature === "update:user" && resource) {
    authorized = false;

    if (user.id === resource.id) {
      authorized = true;
    }
  }

  return authorized;
}

const autorization = {
  can,
};

export default autorization;
