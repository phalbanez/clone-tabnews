import { InternalServerError } from "infra/errors";
import authorization from "models/authorization";

describe("models/authorization", () => {
  describe(".can()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.can(createUser);
      }).toThrow(InternalServerError);
    });

    test("with unknown `feature`", () => {
      const createUser = {
        features: [],
      };

      expect(() => {
        authorization.can(createUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid `user` and known `feature`", () => {
      const createUser = {
        features: ["create:user"],
      };

      expect(authorization.can(createUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("without `user`", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("without `user.features`", () => {
      const createUser = {
        username: "UserWithoutFeatures",
      };

      expect(() => {
        authorization.filterOutput(createUser);
      }).toThrow(InternalServerError);
    });

    test("with unknown `feature`", () => {
      const createUser = {
        features: [],
      };

      expect(() => {
        authorization.filterOutput(createUser, "unknown:feature");
      }).toThrow(InternalServerError);
    });

    test("with valid `user`, known `feature` but no `resource`", () => {
      const createUser = {
        features: ["read:user"],
      };

      expect(() => {
        authorization.filterOutput(createUser, "read:user");
      }).toThrow(InternalServerError);
    });

    test("with valid `user`, known `feature` and `resource`", () => {
      const createUser = {
        features: ["read:user"],
      };

      const resource = {
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
        email: "resource@resource.com",
        password: "resource",
      };

      const result = authorization.filterOutput(
        createUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      });
    });
  });
});
