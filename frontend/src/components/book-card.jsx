import {
  Card,
  Image,
  Group,
  Text,
  Badge,
  Button,
  Rating,
  Flex,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export const BookCard = ({ book }) => {
  const navigate = useNavigate();
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section py="md">
        <Image
          style={{
            mixBlendMode: "multiply",
          }}
          height={360}
          fit="cover"
          withPlaceholder
          src={book.image || "/book-cover-placeholder.png"}
          alt="Book cover"
        />
      </Card.Section>
      <Text weight={500} style={{ minHeight: 60 }}>
        {book.title}
      </Text>
      <Group position="apart" mt="md" mb="xs">
        <Flex>
          <Rating
            defaultValue={book.averageRating ?? 0}
            fractions={10}
            readOnly
          />
          <span>({book.averageRating?.toFixed(2) ?? "0.00"})</span>
        </Flex>
        <Badge color="pink" variant="light">
          {book.release_year}
        </Badge>
      </Group>
      <Flex gap="md" wrap="wrap" py="sm" style={{ minHeight: 80 }}>
        {book.authors.map((author) => (
          <Badge key={author.id} color="blue" variant="light">
            {author.name}
          </Badge>
        ))}
        {book.genres.map((genre) => (
          <Badge key={genre.id} color="green" variant="light">
            {genre.name}
          </Badge>
        ))}
      </Flex>
      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => navigate(`/books/${book.id}`)}
      >
        Se anmeldelser ({book.ratingCount})
      </Button>
    </Card>
  );
};
