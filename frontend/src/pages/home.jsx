import { Grid, Loader, Title } from "@mantine/core";
import { BookCard } from "../components/book-card.jsx";
import {
  useListHighestRatedBooksQuery,
  useListMostRecentBooksQuery,
} from "../client.js";

export const Home = () => {
  const {
    data: highestRatedBooks = [],
    isLoading: isHighestRatedBooksLoading,
  } = useListHighestRatedBooksQuery();
  const { data: mostRecentBooks = [], isLoading: isMostRecentBooksLoading } =
    useListMostRecentBooksQuery();
  const isLoading = isHighestRatedBooksLoading || isMostRecentBooksLoading;
  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div>
            <div>
              <Title order={2}>De beste bøkene</Title>
            </div>
            <Grid columns={4}>
              {highestRatedBooks.map((book) => (
                <Grid.Col span={1} key={book.id}>
                  <BookCard book={book} />
                </Grid.Col>
              ))}
            </Grid>
          </div>
          <div>
            <div>
              <Title order={2}>De nyeste bøkene</Title>
            </div>
            <Grid columns={4}>
              {mostRecentBooks.map((book) => (
                <Grid.Col span={1} key={book.id}>
                  <BookCard book={book} />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};
