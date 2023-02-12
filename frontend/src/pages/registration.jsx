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
        title: "Account registered",
        message:
          "Your account has been registered. You will shortly be redirected",
        color: "blue",
      });
      navigate("/login");
    }
  }, [isSuccess, showNotification]);

  useEffect(() => {
    if (isError) {
      const isExistingUserError = error.response.status === 409;
      showNotification({
        title: "Error",
        message: isExistingUserError
          ? "A user with that email already exists"
          : `Unknown error: ${error.message}`,
      });
    }
  }, [isError, error]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Flex justify="center" align="center" direction="column" gap="md">
        <Title order={1}>Register an account</Title>
        <Text>
          Please create an account to be able to leave reviews on IBDB.
        </Text>
        <TextInput
          {...register("username")}
          placeholder="username"
          error={
            errors.username && <ErrorMessage errors={errors} name="username" />
          }
        />
        <TextInput
          {...register("email")}
          placeholder="email"
          type="email"
          error={errors.email && <ErrorMessage errors={errors} name="email" />}
        />
        <TextInput
          {...register("password")}
          placeholder="password"
          error={
            errors.password && <ErrorMessage errors={errors} name="password" />
          }
        />
        <Button color="indigo" type="submit">
          sign up
        </Button>
      </Flex>
    </form>
  );
};
