import { PokemonTable } from "./components/PokemonTable";
import { useWatchListContext } from "../context/watchList";

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

  return (
    <div>
      <PokemonTable
        data={watchList}
        rowFuntion={removeFromWatchList}
        functionHeader={"Delete"}
      />
    </div>
  );
}
