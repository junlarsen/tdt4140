import { Card, Image, Group, Text, Badge, Button } from "@mantine/core";
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
          fit="cover"
          withPlaceholder
          src={book.image || "/book-cover-placeholder.png"}
          alt="Book cover"
        />
      </Card.Section>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{book.title}</Text>
        <Badge color="pink" variant="light">
          {book.release_year}
        </Badge>
      </Group>
      <Group py="sm">
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
      </Group>
      <Text size="sm" color="dimmed">
        {book.description || "Ingen beskrivelse oppgitt for denne boka."}
      </Text>
      <Button
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => navigate(`/books/${book.id}`)}
      >
        Se anmeldelser
      </Button>
    </Card>
  );
};
