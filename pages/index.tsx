import { dehydrate, useQuery } from "react-query";

import { queryClient, getAllPokemon } from "../src/api";
import { PokemonTable } from "../src/components/PokemonTable";

import { useWatchListContext } from "../context/watchList";
import { Star } from "tabler-icons-react";

export const getServerSideProps = async () => {
  await queryClient.prefetchQuery("pokemon", () =>
    getAllPokemon({ offset: 87, take: 350 })
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home() {
  const [watchList, setWatchList] = useWatchListContext();

  const { data, isLoading, isError } = useQuery("pokemon", () =>
    getAllPokemon({ offset: 87, take: 350 })
  );

  const addToWatchList = (species: string) => {
    const tempData = [...data.getAllPokemon];
    const pokemon = tempData.find((object) => {
      return object.species === species;
    });
    const isExisting = watchList.some((element) => element.species === species);
    if (isExisting) {
      return;
    }
    const tempWatchList = [...watchList];
    tempWatchList.push(pokemon);
    setWatchList(tempWatchList);
  };

  const functionHeader = "Add to watch list";
  const rowFunction = addToWatchList;
  const funcIcon = <Star />;

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error getting data</div>;
  }

  return (
    <div>
      <PokemonTable
        data={data.getAllPokemon}
        rowFunction={rowFunction}
        functionHeader={functionHeader}
        funcIcon={funcIcon}
      />
    </div>
  );
}
