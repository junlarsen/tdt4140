import { useLocalStorage } from "@mantine/hooks";
import { userDtoSchema } from "@gruppe-20/backend";

export const useSession = () => {
  const [authToken] = useLocalStorage({
    key: "auth-token",
    defaultValue: null,
  });
  const [session] = useLocalStorage({
    key: "auth-session",
    defaultValue: null,
  });

  if (!session || !authToken) {
    return null;
  }

  const parsedSession = userDtoSchema.parse(JSON.parse(session));
  return {
    authToken,
    user: parsedSession,
  };
};

export const useLogout = () => {
  const [, setAuthToken] = useLocalStorage({
    key: "auth-token",
    defaultValue: null,
  });
  const [, setSession] = useLocalStorage({
    key: "auth-session",
    defaultValue: null,
  });

  return () => {
    setAuthToken(null);
    setSession(null);
  };
};
