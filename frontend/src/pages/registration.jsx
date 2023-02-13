import { Flex, TextInput, Title, Button, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { createUserSchema } from "@gruppe-20/backend";
import { useRegistrationMutation } from "../client.js";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { useEffect } from "react";

export const Registration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });
  const { error, isSuccess, isError, mutate } = useRegistrationMutation();
  const navigate = useNavigate();

  const onFormSubmit = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Bruker registrert",
        message:
          "Brukeren din har blitt registrert. Du vil nå bli videresendt til siden hvor du kan logge inn.",
        color: "blue",
      });
      navigate("/login");
    }
  }, [isSuccess, showNotification]);

  useEffect(() => {
    if (isError) {
      const isExistingUserError = error.response.status === 409;
      showNotification({
        title: "Feil oppsto",
        message: isExistingUserError
          ? "En bruker med den oppgitte e-post addressen eksisterer allerede"
          : `En ukjent feil oppsto: ${error.message}`,
        color: "red",
      });
    }
  }, [isError, error]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Flex justify="center" align="center" direction="column" gap="md">
        <Title order={1}>Registrer bruker</Title>
        <Text>
          Opprett en bruker for å kunne legge igjen anmeldelser og lage
          personlige lister på IBDB
        </Text>
        <TextInput
          {...register("username")}
          placeholder="navn"
          error={
            errors.username && <ErrorMessage errors={errors} name="username" />
          }
        />
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
        <Button type="submit">Registrer bruker</Button>
      </Flex>
    </form>
  );
};
