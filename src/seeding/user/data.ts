import { User } from "modules/user/user.entity";
import { DeepPartial } from "typeorm";

export const getData = (): DeepPartial<User[]> => {
  return [
    {
      email: process.env.USER_ALPHA,
      username: "cecil01",
      password: process.env.USER_ALPHA_PSS,
    },
    {
      email: "tom.test@gmail.com",
      username: "tom",
      password: process.env.USER_ALPHA_PSS,
    },
    {
      email: "john.test@gmail.com",
      username: "john",
      password: process.env.USER_ALPHA_PSS,
    },
  ];
};
