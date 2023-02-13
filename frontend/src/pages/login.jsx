import { Flex, TextInput, Title, Button, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { loginUserSchema, userDtoSchema } from "@gruppe-20/backend";
import { useLoginMutation } from "../client.js";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";
import { useLocalStorage } from "@mantine/hooks";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });
  const { error, data, isSuccess, isError, mutate } = useLoginMutation();
  const navigate = useNavigate();
  const [, setAuthToken] = useLocalStorage({
    key: "auth-token",
    defaultValue: null,
  });
  const [, setSession] = useLocalStorage({
    key: "auth-session",
    defaultValue: null,
  });

  const onFormSubmit = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      console.log(data.data);
      userDtoSchema.parse(data.data.user);
      setAuthToken(data.data.jwt);
      setSession(JSON.stringify(data.data.user));
      navigate("/");
    }
  }, [isSuccess, data, showNotification]);

  useEffect(() => {
    if (isError) {
      const isWrongPasswordError = error.response.status === 401;
      showNotification({
        title: "Feil oppsto",
        message: isWrongPasswordError
          ? "E-post addressen eller passordet var feil"
          : `En ukjent feil oppsto: ${error.message}`,
        color: "red",
      });
    }
  }, [isError, error]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Flex justify="center" align="center" direction="column" gap="md">
        <Title order={1}>Logg inn</Title>
        <Text>
          Vennligst logg inn ved å skrive inn e-post addressen og passordet
          ditt.
        </Text>
        <TextInput
          {...register("email")}
          placeholder="e-post addresse"
          type="email"
          error={errors.email && <ErrorMessage errors={errors} name="email" />}
        />
        <TextInput
          {...register("password")}
          placeholder="passord"
          type="password"
          error={
            errors.password && <ErrorMessage errors={errors} name="password" />
          }
        />
        <Button type="submit">Logg inn</Button>
      </Flex>
    </form>
  );
};
