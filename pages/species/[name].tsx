import React, { useEffect, useState } from "react";
import { dehydrate, useQuery } from "react-query";
import { queryClient, getPokemonByName } from "../../src/api";
import { Grid, Text, Title, Button, Divider } from "@mantine/core";
import { PokemonEnum } from "../../src/generated/graphql";
import { useWatchListContext } from "../../context/watchList";
import Link from "next/link";
import Image from "next/image";

export const getServerSideProps = async ({ params }) => {
  const enumKey = Object.keys(PokemonEnum).filter(
    (x) => PokemonEnum[x] == params.name.replace(/[^a-zA-Z ]/g, "")
  )[0];
  await queryClient.prefetchQuery("pokemonByName", () =>
    getPokemonByName({ pokemon: PokemonEnum[enumKey] })
  );
  return {
    props: {
      name: params.name,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const PokemonDetail: React.FunctionComponent<{
  name: string;
}> = ({ name }) => {
  const [watchList, setWatchList] = useWatchListContext();
  const [isExisting, setIsExisting] = useState(false);
  const [baseSpecies, setBaseSpecies] = useState("");

  const enumKey = Object.keys(PokemonEnum).filter(
    (x) => PokemonEnum[x] == name
  )[0];

  useEffect(() => {
    checkIfPokemonInWatchList();
    getBaseSpecies();
  }, [watchList]);

  const { data } = useQuery("pokemonByName", () =>
    getPokemonByName({
      pokemon: PokemonEnum[enumKey],
    })
  );

  const checkIfPokemonInWatchList = () => {
    setIsExisting(
      watchList.some((element) => element.species === data.getPokemon.species)
    );
  };
  const getBaseSpecies = () => {
    const species = data.getPokemon.baseSpecies
      ? data.getPokemon.baseSpecies
      : data.getPokemon.species;
    setBaseSpecies(species);
  };

  const addPokemonToWatchList = () => {
    if (isExisting) {
      return;
    }
    const pokemon = {
      species: data.getPokemon.species,
      sprite: data.getPokemon.sprite,
      types: data.getPokemon.types,
    };
    const newWatchList = [...watchList];
    newWatchList.push(pokemon);
    setWatchList(newWatchList);
  };

  if (!data?.getPokemon) {
    return <div>No pokemon found</div>;
  }
  return (
    <Grid>
      <Grid.Col xs={12} md={6} lg={4}>
        <Image
          src={data.getPokemon.sprite}
          alt={data.getPokemon.species}
          width={100}
          height={100}
        />
      </Grid.Col>
      <Grid.Col xs={12} md={6} lg={4}>
        <Title order={1}>{data.getPokemon.species}</Title>

        <Grid mt={10}>
          <Grid.Col span={4}>
            <Title order={5}>PokeDex No.</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.num}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={5}>Color</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.color}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={5}>Type</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>
              {data.getPokemon.types.map((element) => element.name).join(", ")}
            </Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={5}>Levelling Rate</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.levellingRate}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={5}>Bulbapedia Page</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <a href={data.getPokemon.bulbapediaPage}>
              <Text>{data.getPokemon.bulbapediaPage}</Text>
            </a>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={5}>Base Species</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Link href={`/species/${baseSpecies}`}></Link>
            <Text>{baseSpecies}</Text>
          </Grid.Col>

          <Grid.Col>
            <Divider my="sm" />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={3}>Base Stats</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>HP</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.baseStats.hp}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Speed</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.baseStats.speed}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Attack</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.baseStats.attack}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Defense</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.baseStats.defense}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Special Attack</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.baseStats.specialattack}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Special Defence</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.baseStats.specialdefense}</Text>
          </Grid.Col>

          <Grid.Col>
            <Divider my="sm" />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={3}>Gender</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Female</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.gender.female}</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Title order={6}>Male</Title>
          </Grid.Col>
          <Grid.Col span={8}>
            <Text>{data.getPokemon.gender.male}</Text>
          </Grid.Col>

          <Grid.Col>
            <Divider my="sm" />
          </Grid.Col>

          <Grid.Col span={12}>
            <Title order={3}>Flavor Texts</Title>
          </Grid.Col>
          {data.getPokemon.flavorTexts.map((text) => {
            return (
              <>
                <Grid.Col span={4}>
                  <Title order={6}>Game</Title>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text>{text.game}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Title order={6}>Flavour</Title>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Text>{text.flavor}</Text>
                </Grid.Col>
              </>
            );
          })}
        </Grid>
      </Grid.Col>

      <Grid.Col xs={12} md={6} lg={4}>
        <Button onClick={addPokemonToWatchList} fullWidth disabled={isExisting}>
          {isExisting
            ? `Already added to watchlist`
            : ` Add ${data.getPokemon.species} to watchlist`}
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default PokemonDetail;
