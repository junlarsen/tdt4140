import { hash } from "bcrypt";
import { userSchema } from "./user.js";

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
