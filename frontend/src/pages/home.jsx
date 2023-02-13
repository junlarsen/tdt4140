import { useLogout, useSession } from "../auth.js";
import { Button } from "@mantine/core";

export const Home = () => {
  const session = useSession();

  return (
    <div>
      Hello to IBDB
      {session
        ? `Welcome user ${JSON.stringify(session.user)}`
        : "Not logged in"}
    </div>
  );
};
