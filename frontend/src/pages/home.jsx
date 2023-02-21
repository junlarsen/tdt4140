import { useLogout, useSession } from "../auth.js";
import { Button, Grid } from "@mantine/core";
import { BookCard } from "../components/book-card.jsx";
import logo from "../../public/harry-potter-1.png";
import Narnia from "../../public/narnia-korrekt.jpg";
import Sleep from "../../public/why-we-sleep.png";
import ArtOf from "../../public/art-og-fck.png";
import WorkingBackwards from "../../public/working-backwards.png";

export const Home = () => {
  const session = useSession();

  return (
    <div>
      <div>
        <div>
          <h3>De mest populære</h3>
        </div>
        <Grid columns={4}>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "Harry Potter",
                description: "Some book about some wizardry",
                release_year: 2000,
                image: logo,
                genres: [{ name: "Fantasy" }],
                authors: [{ name: "J.K. Rowling" }],
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "The Chronicles Of Narnia",
                description: "Fantasy ",
                release_year: 2001,
                image: Narnia,
                genres: [{ name: "Fantasy" }],
                authors: [{ name: "C. S. Lewis" }],
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "Why We Sleep",
                description: "Fact book",
                release_year: 2019,
                image: Sleep,
                genres: [{ name: "Fact book" }],
                authors: [{ name: "Matthew Walker, Steve West, et al" }],
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "The Subtle Art of Not Giving a F*ck",
                description: "Fact book",
                release_year: 2019,
                image: ArtOf,
                genres: [{ name: "Fact book" }],
                authors: [{ name: "Mark Manson" }],
              }}
            />
          </Grid.Col>
        </Grid>
        {/*  Hello to IBDB
        {session
          ? `Welcome user ${JSON.stringify(session.user)}`
          : "Not logged in"} */}
      </div>
      <div>
        <div>
          <h3>Nyheter</h3>
        </div>
        <Grid columns={4}>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "Working Backwards",
                description: "Book about business",
                release_year: 2021,
                image: WorkingBackwards,
                genres: [{ name: "Business" }],
                authors: [{ name: "Colin Bryar" }],
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "The Chronicles Of Narnia",
                description: "Fantasy ",
                release_year: 2001,
                image: Narnia,
                genres: [{ name: "Fantasy" }],
                authors: [{ name: "C. S. Lewis" }],
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "Why We Sleep",
                description: "Fact book",
                release_year: 2019,
                image: Sleep,
                genres: [{ name: "Fact book" }],
                authors: [{ name: "Matthew Walker, Steve West, et al" }],
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <BookCard
              book={{
                title: "The Subtle Art of Not Giving a F*ck",
                description: "Fact book",
                release_year: 2019,
                image: ArtOf,
                genres: [{ name: "Fact book" }],
                authors: [{ name: "Mark Manson" }],
              }}
            />
          </Grid.Col>
        </Grid>
      </div>
    </div>
  );
};
