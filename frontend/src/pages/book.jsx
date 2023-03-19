import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useListBooksQuery,
  useListReviewsQuery,
} from "../client.js";
import {
  Button,
  Flex,
  Grid,
  Image,
  List,
  Group,
  Loader,
  Rating,
  Table,
  Text,
  Textarea,
  Title,
  Badge,
} from "@mantine/core";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReviewSchema } from "@gruppe-20/backend";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useMemo } from "react";
import { showNotification } from "@mantine/notifications";
import { useSession } from "../auth.js";

export const Book = () => {
  const navigate = useNavigate();
  const params = useParams();
  const session = useSession();
  const bookPathParameter = params.book;
  const { data: books = [], isLoading: isBooksLoading } = useListBooksQuery();
  const { data: allReviews = [], isLoading: isReviewsLoading } =
    useListReviewsQuery();
  const isLoading = isBooksLoading || isReviewsLoading;
  const book =
    books.find((book) => book.id === Number(bookPathParameter)) ?? null;
  const reviews = allReviews.filter((review) => review.book_id === book.id);
  const isLoggedIn = session !== null;
  const isAbleToSubmitReview =
    isLoggedIn && !reviews.some((review) => review.user_id === session.user.id);

  return (
    <div>
      <Button onClick={() => navigate(-1)}>Gå tilbake til oversikt</Button>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid columns={4} gutter="xl">
          <Grid.Col span={1}>
            <Title order={2}>Informasjon om &quot;{book.title}&quot;</Title>
            <Flex direction="column" gap="sm">
              <Image
                style={{
                  mixBlendMode: "multiply",
                }}
                fit="cover"
                withPlaceholder
                src={book.image || "/book-cover-placeholder.png"}
                alt="Book cover"
              />
              <Text>
                {book.title} er en bok utgitt i {book.release_year} som er
                skrevet av{" "}
                {book.authors.map((author) => author.name).join(", ")}.
              </Text>
              <Title order={3}>Vurderinger</Title>
              <Text>
                Her er en oversikt over vurdering er som er gitt av diverse
                kilder.
              </Text>
              <List>
                <List.Item>
                  <Group>
                    IBDB Brukere:
                    <Rating
                      defaultValue={book.averageRating}
                      fractions={10}
                      readOnly
                    />
                    <span>({(book.averageRating ?? 0).toFixed(2)})</span>
                  </Group>
                </List.Item>
                <List.Item>
                  <Group>
                    GoodReads Brukere:
                    <Rating
                      defaultValue={book.goodreads_rating}
                      fractions={10}
                      readOnly
                    />
                    <span>({book.goodreads_rating?.toFixed(2)})</span>
                  </Group>
                </List.Item>
                <List.Item>
                  <Group>
                    Avisanmeldelser:
                    <Rating
                      defaultValue={book.newspapers_rating}
                      fractions={10}
                      readOnly
                    />
                    <span>({book.newspapers_rating.toFixed(2)})</span>
                  </Group>
                </List.Item>
              </List>
              <Group>
                {book.genres.map((genre) => (
                  <Badge key={genre.name}>{genre.name}</Badge>
                ))}
              </Group>
              <Text size="sm" color="dimmed">
                {book.description ||
                  "Ingen beskrivelse oppgitt for denne boka."}
              </Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={3}>
            <Title order={2}>Anmeldelser av {book.title}</Title>
            <Text>
              {reviews.length === 0
                ? "Hittil har ingen av våre brukere anmeldt denne boka."
                : "Her er en liste over anmeldelser våre brukere har gitt."}
            </Text>
            {!isLoggedIn ? (
              <Text color="dimmed">
                Du må være logged inn for å legge inn anmeldelser.
              </Text>
            ) : isAbleToSubmitReview ? (
              <BookReviewComment bookId={book.id} />
            ) : (
              <Text color="dimmed">
                Du har allerede lagt inn en anmeldelse for denne boka.
              </Text>
            )}
            <BookReviewTable reviews={reviews} />
          </Grid.Col>
        </Grid>
      )}
    </div>
  );
};

const BookReviewComment = ({ bookId }) => {
  const { error, isSuccess, isError, mutate } = useCreateReviewMutation();
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      book_id: bookId,
      rating: 2.5,
    },
  });
  const onFormSubmit = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Anmelding registrert",
        message: "Anmeldelsen din har blitt registrert",
        color: "blue",
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      showNotification({
        title: "Feil oppsto",
        message: `En ukjent feil oppsto: ${error.message}`,
        color: "red",
      });
    }
  }, [isError, error]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Flex direction="column" py="lg">
        <Text color="dimmed">Legg inn en anmeldelse for denne boka</Text>
        <Textarea
          {...register("comment")}
          placeholder="Kommentar..."
          error={
            errors.comment && <ErrorMessage errors={errors} name="comment" />
          }
        />
        <Group>
          <Text>Vurdering av boka:</Text>
          <Controller
            control={control}
            name="rating"
            render={({ field, fieldState, formState }) => (
              <Rating
                ref={field.ref}
                defaultValue={2.5}
                fractions={2}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Group>
        <Button type="submit">Send inn anmeldelse</Button>
      </Flex>
    </form>
  );
};

const BookReviewTable = ({ reviews }) => {
  const session = useSession();
  const { isSuccess, mutate } = useDeleteReviewMutation();
  const isAdmin = useMemo(() => session?.user?.user_role === "a", [session]);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("username", {
      header: () => <Text>Brukernavn</Text>,
    }),
    columnHelper.accessor("comment", {
      header: () => <Text>Kommentar</Text>,
    }),
    columnHelper.accessor("rating", {
      header: () => <Text>Vurdering</Text>,
      cell: (info) => (
        <Rating defaultValue={info.getValue() % 10} fractions={2} readOnly />
      ),
    }),
  ];
  if (isAdmin) {
    columns.push(
      columnHelper.accessor((row) => row, {
        id: "delete",
        header: () => <Text>Slett</Text>,
        cell: (info) => {
          const row = info.getValue();
          const onClick = () =>
            mutate({ user_id: row.user_id, book_id: row.book_id });
          return (
            <Button variant="outline" onClick={onClick}>
              Slett kommentar
            </Button>
          );
        },
      }),
    );
  }
  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Suksess",
        message: `Kommentaren har blitt slettet`,
        color: "blue",
      });
    }
  }, [isSuccess]);
  const table = useReactTable({
    columns,
    data: reviews,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
