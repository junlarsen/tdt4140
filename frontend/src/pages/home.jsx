import { Box, Flex, Grid, Group, Image, Loader, Title } from "@mantine/core";
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
        <Flex direction="column" gap="md">
          <div>
            <Title order={2}>
              Topplista - de beste og mest anmeldte bøkene på markedet!
            </Title>
            <Grid columns={6}>
              {highestRatedBooks.map((book) => (
                <Grid.Col span={1} key={book.id}>
                  <BookCard book={book} />
                </Grid.Col>
              ))}
            </Grid>
          </div>
          <div>
            <Title order={2}>
              Up & coming - de nyeste bøkene av de beste forfatterene
            </Title>
            <Grid columns={6}>
              {mostRecentBooks.map((book) => (
                <Grid.Col span={1} key={book.id}>
                  <BookCard book={book} />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        </Flex>
      )}
    </div>
  );
};
