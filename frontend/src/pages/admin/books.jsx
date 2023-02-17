import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useCreateBookMutation } from "../../client.js";
import { createBookSchema } from "@gruppe-20/backend";
import {
  Flex,
  TextInput,
  Title,
  Text,
  MultiSelect,
  Button,
  Input,
  Loader,
  Modal,
} from "@mantine/core";
import { ErrorMessage } from "@hookform/error-message";
import { useListGenresQuery, useListAuthorsQuery } from "../../client.js";

export const AdminBooks = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <Flex direction="column" rowGap="md">
      <Title>Bokoversikt</Title>
      <Text>
        Her får du en oversikt over eksisterende bøker, og muligheten til å
        legge til nye
      </Text>
      <Button onClick={() => setPopupVisible(true)}>Opprett ny</Button>
      {isPopupVisible && (
        <AdminBooksPopup onClose={() => setPopupVisible(false)} />
      )}
    </Flex>
  );
};

const AdminBooksPopup = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      authors: [],
      genres: [],
    },
  });

  const { data: genres = [], isLoading: isGenresLoading } =
    useListGenresQuery();
  const { data: authors = [], isLoading: isAuthorsLoading } =
    useListAuthorsQuery();
  const isLoading = isGenresLoading || isAuthorsLoading;
  const selectGenresInput = genres.map((genre) => ({
    label: genre.name,
    value: genre.id,
  }));
  const selectAuthorsInput = authors.map((author) => ({
    label: author.name,
    value: author.id,
  }));

  const { isSuccess, isError, error, mutate } = useCreateBookMutation();
  const onFormSubmit = (data) => {
    onClose();
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Suksess",
        message: `Boken har blitt opprettet`,
        color: "blue",
      });
      onClose();
    }
  }, [isSuccess, showNotification]);

  useEffect(() => {
    if (isError) {
      showNotification({
        title: "Feil oppsto",
        message: `En ukjent feil oppsto: ${error.message}`,
        color: "red",
      });
    }
  }, [isError, error, showNotification]);

  return (
    <Modal opened title="Oprett ny bok" onClose={onClose}>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Flex direction="column" gap="md">
            <TextInput
              {...register("title")}
              placeholder="tittel"
              error={
                errors.title && <ErrorMessage errors={errors} name="title" />
              }
            />
            <Input
              {...register("release_year", {
                valueAsNumber: true,
              })}
              placeholder="utgivelsesår"
              type="number"
              error={
                errors.release_year && (
                  <ErrorMessage errors={errors} name="release_year" />
                )
              }
            />
            <TextInput
              {...register("description")}
              placeholder="beskrivelse"
              error={
                errors.description && (
                  <ErrorMessage errors={errors} name="description" />
                )
              }
            />
            <TextInput
              {...register("image")}
              type="url"
              placeholder="lenke til bilde"
              error={
                errors.image && <ErrorMessage errors={errors} name="image" />
              }
            />
            <Controller
              control={control}
              name="genres"
              render={({ field, fieldState, formState }) => (
                <MultiSelect
                  data={selectGenresInput}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  ref={field.ref}
                  placeholder="velg minst en sjanger"
                  searchable
                  error={
                    formState.errors.genres && (
                      <ErrorMessage errors={errors} name="genres" />
                    )
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="authors"
              render={({ field, fieldState, formState }) => (
                <MultiSelect
                  data={selectAuthorsInput}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  ref={field.ref}
                  placeholder="velg minst en forfatter"
                  searchable
                  error={
                    formState.errors.genres && (
                      <ErrorMessage errors={errors} name="authors" />
                    )
                  }
                />
              )}
            />
            <Button type="submit">Legg til bok</Button>
          </Flex>
        </form>
      )}
    </Modal>
  );
};
