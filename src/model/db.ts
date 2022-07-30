import mongoose, { Collection, connection } from "mongoose";
import { readFile } from "fs";
import { resolve as resolvePath } from "path";
export async function connect() {
  const { databaseURI } = await readCredentials();
  return mongoose.connect(databaseURI);
}
type DatabaseCredentials = {
  databaseURI: string;
};

export function readCredentials() {
  return new Promise<DatabaseCredentials>(async (resolve, reject) => {
    readFile(
      resolvePath(__dirname, "../", "credentials.json"),
      "utf-8",
      (error, data) => {
        if (error) reject(error);
        const credentials: DatabaseCredentials = JSON.parse(data);
        resolve(credentials);
      }
    );
  });
}
export async function disconnect() {
  await mongoose.connection.dropDatabase();
  return await mongoose.connection.close();
}

export function clear() {
  return new Promise(async (resolve, reject) => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    resolve(undefined);
  });
}
