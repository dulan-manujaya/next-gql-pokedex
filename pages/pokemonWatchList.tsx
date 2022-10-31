import {
  Table,
  Pagination,
  TextInput,
  Grid,
  Select,
  Button,
  Text,
  UnstyledButton,
  Group,
  Center,
} from "@mantine/core";
import Image from "next/image";
import { Trash, ChevronDown, ChevronUp, Selector } from "tabler-icons-react";

import { useState } from "react";
import { TypesEnum } from "../src/generated/graphql";

import { useWatchListContext } from "../context/watchList";
import { useEffect } from "react";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

interface RowData {
  species: string;
  types: string;
}

export default function WatchList() {
  const [activePage, setPage] = useState(1);
  const [selectValue, setSelectValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const [data, setData] = useState([]);
  const [watchList, setWatchList] = useWatchListContext();

  useEffect(() => {
    setData(filterData(watchList));
  }, [watchList, searchValue, selectValue]);

  function sortData(
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean }
  ) {
    const { sortBy } = payload;

    if (!sortBy) {
      return data;
    }

    return [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    });
  }

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setData(sortData(data, { sortBy: field, reversed }));
  };

  const filterData = (items) => {
    const searchQuery = searchValue.toLowerCase().trim();
    const selectQuery = selectValue.toLowerCase().trim();
    return items.filter(
      (pokemon) =>
        pokemon.species.toLowerCase().includes(searchQuery) &&
        pokemon.types.toLowerCase().includes(selectQuery)
    );
  };

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
    }
  };

  const removeFromWatchList = (index) => {
    const newWatchList = [...watchList];
    newWatchList.splice(index, 1);
    setWatchList(newWatchList);
  };

  const Th = ({ children, reversed, sorted, onSort }: ThProps) => {
    const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
    return (
      <th>
        <UnstyledButton onClick={onSort}>
          <Group position="apart">
            <Text weight={500} size="sm">
              {children}
            </Text>
            <Center>
              <Icon size={14} />
            </Center>
          </Group>
        </UnstyledButton>
      </th>
    );
  };
  const ths = (
    <tr>
      <th>Sprite</th>
      <Th
        sorted={sortBy === "species"}
        reversed={reverseSortDirection}
        onSort={() => setSorting("species")}
      >
        Name
      </Th>
      <Th
        sorted={sortBy === "types"}
        reversed={reverseSortDirection}
        onSort={() => setSorting("types")}
      >
        Type
      </Th>
      <th>Delete</th>
    </tr>
  );

  const ths1 = (
    <tr>
      <th>Sprite</th>
      <th>Name</th>
      <th>Type</th>
      <th>Delete</th>
    </tr>
  );

  const rows = paginate(data, activePage, 10).items?.map((element, i) => (
    <tr key={i}>
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
      <td>{element.types}</td>
      <td>
        <Button onClick={() => removeFromWatchList(i)}>
          <Trash />
        </Button>
      </td>
    </tr>
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
          ;
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            placeholder="Type a species name"
          />
        </Grid.Col>
      </Grid>

      <Table captionSide="bottom" striped highlightOnHover>
        <thead>{ths}</thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={4}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Pagination
        withEdges
        page={activePage}
        onChange={setPage}
        total={Math.ceil(watchList.length / 10)}
      />
    </div>
  );
}
