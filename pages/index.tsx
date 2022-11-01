import { dehydrate, useQuery } from "react-query";
import { Table, Pagination, TextInput, Grid, Select } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

import { queryClient, getAllPokemon } from "../src/api";
import { useEffect, useState } from "react";
import { TypesEnum } from "../src/generated/graphql";

export const getServerSideProps = async () => {
  await queryClient.prefetchQuery("pokemon", () =>
    getAllPokemon({ offset: 87, take: 1000 })
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function Home() {
  const [activePage, setPage] = useState(1);
  const [selectValue, setSelectValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data } = useQuery(
    "pokemon",
    () => getAllPokemon({ offset: 87, take: 1000 }),
    {
      keepPreviousData: true,
      select: (pokemonData) =>
        pokemonData.getAllPokemon.filter(
          (pokemon) =>
            pokemon.species.includes(searchValue.toLowerCase()) &&
            pokemon.types.some((type) =>
              type.name.toLowerCase().includes(selectValue.toLowerCase())
            )
        ),
    }
  );

  const paginate = (items, page = 1, perPage = 10) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);

    return {
      previousPage: page - 1 ? page - 1 : null,
      nextPage: totalPages > page ? page + 1 : null,
      total: items.length,
      totalPages: totalPages,
      items: paginatedItems,
    };
  };

  const changeSelectValue = (value) => {
    if (value == null) {
      setSelectValue("");
    } else {
      setSelectValue(value);
      setPage(1);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectValue, searchValue]);

  const ths = (
    <tr>
      <th>Sprite</th>
      <th>Name</th>
      <th>Type</th>
    </tr>
  );
  const rows = paginate(data, activePage, 10).items?.map((element, i) => (
    <Link href={`/pokemon/${element.species}`} key={i}>
      <tr>
        <td>
          <Image
            src={element.sprite}
            height={50}
            width={50}
            placeholder="blur"
            blurDataURL="/master-ball.png"
          />
        </td>
        <td>{element.species}</td>
        <td>{element.types.map((element) => element.name).join(", ")}</td>
      </tr>
    </Link>
  ));
  return (
    <div>
      <Grid>
        <Grid.Col span={4}>
          <Select
            value={selectValue}
            onChange={changeSelectValue}
            data={Object.values(TypesEnum)}
            placeholder="Pick a type"
            searchable
            clearable
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            placeholder="Search anything"
          />
        </Grid.Col>
      </Grid>

      <Table captionSide="bottom" striped highlightOnHover>
        <thead>{ths}</thead>
        <tbody>{rows}</tbody>
      </Table>
      <Pagination
        withEdges
        page={activePage}
        onChange={setPage}
        total={Math.ceil(data.length / 10)}
      />
    </div>
  );
}
