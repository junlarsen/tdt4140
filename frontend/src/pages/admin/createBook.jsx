import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { useCreateBookMutation } from "../../client.js";
import { createBookSchema } from "@gruppe-20/backend";
import { Flex, TextInput, Title, Text, MultiSelect, Button, Input } from "@mantine/core";
import { ErrorMessage } from "@hookform/error-message";
import { useListGenresNameOnlyQuery, useListAuthorsOnlyNameQuery } from "../../client.js";

export const CreateBook = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBookSchema),
  });

  const { data: genres = [] } = useListGenresNameOnlyQuery();

  const { data: authors = [] } = useListAuthorsOnlyNameQuery();

  const { isSuccess, mutate } = useCreateBookMutation();

  const onFormSubmit = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Bok registrert.",
        message: "Boken er blitt registrert.",
        color: "blue",
      });
    } else{
      showNotification({
        title: "Noe gikk galt",
        message: "Noe gikk galt",
        color: "red",
      });
    }
  }, [isSuccess, showNotification]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Flex justify="center" align="center" direction="column" gap="md">
        <Title order={1}>Legg til bok</Title>
        <Text>Legg til en bok her.</Text>
        <TextInput
          {...register("title")}
          placeholder="Tittel"
          error={errors.title && <ErrorMessage errors={errors} name="title" />}
        />
        <Input
          {...register("release_year")}
          placeholder="Utgivelsesår"
          type="number"
          error={
            errors.release_year && (
              <ErrorMessage errors={errors} name="release_year" />
            )
          }
        />
        <TextInput
          {...register("description")}
          placeholder="Beskrivelse"
          error={
            errors.description && (
              <ErrorMessage errors={errors} name="description" />
            )
          }
        />
        <TextInput
          {...register("image")}
          type="url"
          error={errors.image && <ErrorMessage errors={errors} name="image" />}
        />
        <MultiSelect
          data={genres}
          label="Registrerte sjangre"
          placeholder="Velg en sjanger"
          searchable
        />
        <MultiSelect
          data={authors}
          label="Registrerte forfattere"
          placeholder="Velg en forfatter"
          searchable
        />
        <Button type="submit">Legg til bok</Button>
      </Flex>
    </form>
  );
};
