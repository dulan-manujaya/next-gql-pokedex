import { Card, Center, Grid, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { dehydrate, useQuery } from "react-query";
import Image from "next/image";

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

const PokemonSpecies: NextPage<{
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
          <Grid.Col xs={12} md={6} lg={3} key={[f.species, i].join(":")} p={5}>
            <Link href={`/pokemon/${f.species}`} passHref>
              <Card>
                <Center>
                  <Image
                    height={100}
                    src={f.sprite}
                    alt={f.species}
                    width={100}
                  />
                </Center>
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
