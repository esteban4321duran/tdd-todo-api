import { connect, readCredentials, disconnect, clear } from "../src/model/db";
describe("Database Client", () => {
  it("should connect to MongoDB", () => {
    return connect().then((successData) => {
      expect(successData).toBeDefined();
    });
  });
  it("should disconnect from database", () => {
    return disconnect().then((successData) => {
      expect(successData).toBeUndefined();
    });
  });
  it("should clear database", () => {
    return clear().then((successData) => {
      expect(successData).toBeUndefined();
    });
  });
});
describe("Credentials", () => {
  it("should read credentials from file system", () => {
    return readCredentials().then((credentials) => {
      expect(credentials).toHaveProperty("databaseURI");
    });
  });
});
