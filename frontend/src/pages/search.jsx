import { useSearchParams } from "react-router-dom";
import { useListBooksQuery, useListGenresQuery } from "../client.js";
import {
  Center,
  Flex,
  Grid,
  Loader,
  MultiSelect,
  NumberInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { BookCard } from "../components/book-card.jsx";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

export const Search = () => {
  const [params] = useSearchParams();
  const { data: books = [], isLoading: isBooksLoading } = useListBooksQuery();
  const { data: genres = [], isLoading: isGenresLoading } =
    useListGenresQuery();
  const isLoading = isBooksLoading || isGenresLoading;

  const queryFromParameters = params.get("q");
  const { control, register, watch, setValue } = useForm({
    defaultValues: {
      releaseYear: null,
      genres: [],
      text: queryFromParameters ?? "",
    },
  });

  // FYI: This is very terrible practice but we're just shipping a toy product
  // so I couldn't care less <3
  useEffect(() => {
    const input = document.getElementById(
      "search-input-hack-dont-do-this-please",
    );
    if (!input) {
      return;
    }
    const listener = () => {
      setValue("text", input.value);
    };
    input.addEventListener("input", listener);
    return () => input.removeEventListener("input", listener);
  }, [setValue]);

  const textQuery = watch("text");
  const releaseYearQuery = watch("releaseYear");
  const genresQuery = watch("genres");
  const matches = useMemo(
    () =>
      books.filter((book) => {
        const regexp = new RegExp(textQuery, "g");
        const isMatchingAuthor =
          !textQuery ||
          book.authors.some(
            (author) =>
              regexp.test(author.name) ||
              author.name.toLowerCase().includes(textQuery.toLowerCase()),
          );
        const isMatchingBook =
          !textQuery ||
          regexp.test(book.title) ||
          book.title.toLowerCase().includes(textQuery.toLowerCase());

        const isMatchingYear =
          !releaseYearQuery || book.release_year === releaseYearQuery;

        const isMatchingGenre =
          genresQuery.length === 0 ||
          book.genres.some((genre) => genresQuery.includes(genre.id));

        return (
          (isMatchingAuthor || isMatchingBook) &&
          isMatchingYear &&
          isMatchingGenre
        );
      }),
    [books, genresQuery, releaseYearQuery, textQuery],
  );

  const selectGenresInput = genres.map((genre) => ({
    label: genre.name,
    value: genre.id,
  }));

  return (
    <Flex direction="column" gap="md">
      <Title>Boksøk</Title>
      <Text>
        Dette er en fleksibel søkeside som lar deg søke etter bøker, forfattere,
        utgivelsesår og sjangere.
      </Text>
      <Text>Dette er en liste over bøkene som matchet søket ditt.</Text>

      <form>
        <Flex direction="row">
          <TextInput
            {...register("text")}
            label="Forfatter / Tittel"
            placeholder="J. K. Rowling"
          />
          <Controller
            control={control}
            name="releaseYear"
            render={({ field }) => (
              <NumberInput
                label="Utgivelsesår"
                valu={field.value}
                onChange={(value) => field.onChange(value)}
                ref={field.ref}
                placeholder="1999"
                type="number"
              />
            )}
          />
          <Controller
            control={control}
            name="genres"
            render={({ field }) => (
              <MultiSelect
                label="Sjangere"
                data={selectGenresInput}
                value={field.value}
                onChange={(value) => field.onChange(value)}
                ref={field.ref}
                searchable
                placeholder="Horror"
              />
            )}
          />
        </Flex>
      </form>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {matches.length !== 0 ? (
            <Grid columns={6}>
              {matches.map((book) => (
                <Grid.Col key={book.id} span={1}>
                  <BookCard book={book} />
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Center>
              <Text>
                Ingen bøker matchet søket ditt, vennlighst prøv et annet søkeord
              </Text>
            </Center>
          )}
        </div>
      )}
    </Flex>
  );
};
