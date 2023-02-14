import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "./user.js";
import { promisify } from "util";

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const JWT_PASSWORD = "secret";

export class UserService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async create({ username, email, password }) {
    const user = await this.#database.get(
      "INSERT INTO users (username, password, email) VALUES ($username, $password, $email) RETURNING *",
      {
        $username: username,
        $email: email,
        $password: await hash(password, 10),
      },
    );
    return userSchema.parse(user);
  }

  async login(email, password) {
    const user = await this.find(email);
    if (user === null) {
      return { error: "invalid_user" };
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      return { error: "invalid_password" };
    }
    return {
      jwt: await sign(
        {
          ...user,
          password: undefined,
        },
        JWT_PASSWORD,
        {
          expiresIn: "1h",
        },
      ),
      user,
    };
  }

  async decrypt(jwt) {
    try {
      return await verify(jwt, JWT_PASSWORD);
    } catch (err) {
      return null;
    }
  }

  async find(email) {
    const user = await this.#database.get(
      "SELECT * FROM users WHERE email=$email",
      {
        $email: email,
      },
    );
    return user ? userSchema.parse(user) : null;
  }
}
