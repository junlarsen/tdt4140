import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import {
  createUserSchema,
  loginUserSchema,
  createGenreSchema,
  createAuthorSchema,
  createBookSchema,
  createReviewSchema,
  deleteReviewSchema,
} from "@gruppe-20/backend";
import { useSession } from "./auth.js";

const baseUrl =
  window.location.hostname === "tdt4140-20.jun.codes"
    ? "http://tdt4140-20.jun.codes/web-api/"
    : "http://localhost:3001/api";

export const useRegistrationMutation = () =>
  useMutation({
    mutationFn: async (data) => {
      createUserSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/users/`,
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
        url: `${baseUrl}/users/login/`,
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
        url: `${baseUrl}/genres/`,
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
        url: `${baseUrl}/genres/`,
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
        url: `${baseUrl}/authors/`,
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
        url: `${baseUrl}/authors/`,
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

export const useListBooksQuery = () =>
  useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await axios({
        url: `${baseUrl}/books/`,
        method: "GET",
      });
      return response.data;
    },
  });

export const useListHighestRatedBooksQuery = () =>
  useQuery({
    queryKey: ["books-rated"],
    queryFn: async () => {
      const response = await axios({
        url: `${baseUrl}/books/highest-rated/`,
        method: "GET",
      });
      return response.data;
    },
  });

export const useListMostRecentBooksQuery = () =>
  useQuery({
    queryKey: ["books-recent"],
    queryFn: async () => {
      const response = await axios({
        url: `${baseUrl}/books/most-recent/`,
        method: "GET",
      });
      return response.data;
    },
  });

export const useCreateBookMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async (data) => {
      createBookSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/books/`,
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
      queryClient.invalidateQueries(["books-recent"]);
      queryClient.invalidateQueries(["books-rated"]);
    },
  });
};

export const useFetchRatingsMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async () => {
      await axios({
        url: `${baseUrl}/books/fetch-ratings`,
        method: "POST",
        headers: {
          authorization: `Token ${session?.authToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
    },
  });
};

export const useListReviewsQuery = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await axios({
        url: `${baseUrl}/reviews/`,
        method: "GET",
      });
      return response.data;
    },
  });

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async (data) => {
      createReviewSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/reviews/`,
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
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["books"]);
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  return useMutation({
    mutationFn: async (data) => {
      deleteReviewSchema.parse(data);
      const response = await axios({
        url: `${baseUrl}/reviews/`,
        method: "DELETE",
        data,
        headers: {
          "content-type": "application/json",
          authorization: `Token ${session?.authToken}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["books"]);
    },
  });
};
