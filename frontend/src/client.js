import { useMutation } from "react-query";
import axios from "axios";
import { createUserSchema, loginUserSchema } from "@gruppe-20/backend";

const baseUrl = "http://localhost:3001";

export const useRegistrationMutation = () =>
  useMutation({
    mutationFn: (data) => {
      createUserSchema.parse(data);
      return axios({
        url: `${baseUrl}/api/users/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
        },
      });
    },
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data) => {
      loginUserSchema.parse(data);
      return axios({
        url: `${baseUrl}/api/users/login/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
        },
      });
    },
  });
