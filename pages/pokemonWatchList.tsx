import { PokemonTable } from "../src/components/PokemonTable";
import { useWatchListContext } from "../context/watchList";
import { Trash } from "tabler-icons-react";

export default function WatchList() {
  const [watchList, setWatchList] = useWatchListContext();

  const removeFromWatchList = (species) => {
    const newWatchList = [...watchList];
    const index = newWatchList.findIndex((object) => {
      return object.species === species;
    });
    newWatchList.splice(index, 1);
    setWatchList(newWatchList);
  };

  const functionHeader = "Remove from watch list";
  const rowFunction = removeFromWatchList;
  const funcIcon = <Trash />;

  return (
    <div>
      <PokemonTable
        data={watchList}
        rowFunction={rowFunction}
        functionHeader={functionHeader}
        funcIcon={funcIcon}
      />
    </div>
  );
}
