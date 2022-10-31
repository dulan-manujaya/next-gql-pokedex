import { Card, Grid, Image, Text, Title } from "@mantine/core";
import Link from "next/link";
import { dehydrate, useQuery } from "react-query";

import { queryClient, getFuzzyPokemon } from "../../src/api";

export const getServerSideProps = async ({ params }) => {
  await queryClient.prefetchQuery("pokemonSearch", () =>
    getFuzzyPokemon({ pokemon: params.name, take: 50 })
  );
  return {
    props: {
      name: params.name,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const PokemonSpecies: React.FunctionComponent<{
  name: string;
}> = ({ name }) => {
  const { data } = useQuery(
    ["pokemonSearch"],
    () => getFuzzyPokemon({ pokemon: name, take: 50 }),
    {
      keepPreviousData: true,
      select: (pokemonData) =>
        pokemonData.getFuzzyPokemon.filter((pokemon) =>
          pokemon.species.includes(name)
        ),
    }
  );
  return (
    <div>
      <Grid>
        {data?.map((f, i) => (
          <Grid.Col xs={12} md={6} lg={4} key={[f.species, i].join(":")} p={5}>
            <Link href={`/pokemon/${f.species}`} passHref>
              <Card>
                <Card.Section>
                  <Image height={350} src={f.sprite} alt={f.species} />
                </Card.Section>
                <Title order={3}>{f.species}</Title>
                <Text>{f.types.map((element) => element.name).join(", ")}</Text>
              </Card>
            </Link>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
};

export default PokemonSpecies;
