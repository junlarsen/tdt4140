import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import {
  createUserSchema,
  loginUserSchema,
  createGenreSchema,
  createAuthorSchema,
  createBookSchema,
} from "@gruppe-20/backend";
import { useSession } from "./auth.js";

const baseUrl = "http://localhost:3001";

export const useRegistrationMutation = () =>
  useMutation({
    mutationFn: async (data) => {
      createUserSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/api/users/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    },
  });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data) => {
      loginUserSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/api/users/login/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    },
  });

export const useListGenresQuery = () =>
  useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await axios({
        url: `${baseUrl}/api/genres/`,
        method: "GET",
      });
      return response.data;
    },
  });

export const useCreateGenreMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async (data) => {
      createGenreSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/api/genres/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
          authorization: `Token ${session?.authToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["genres"]);
    },
  });
};

export const useListAuthorsQuery = () =>
  useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const response = await axios({
        url: `${baseUrl}/api/authors/`,
        method: "GET",
      });
      return response.data;
    },
  });

export const useCreateAuthorMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async (data) => {
      createAuthorSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/api/authors/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
          authorization: `Token ${session?.authToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["authors"]);
    },
  });
};

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async (data) => {
      createBookSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/api/books/`,
        method: "POST",
        data,
        headers: {
          "content-type": "application/json",
          authorization: `Token ${session?.authToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
  });
};
