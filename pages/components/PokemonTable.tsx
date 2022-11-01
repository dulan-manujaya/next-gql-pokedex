import {
  Grid,
  Select,
  TextInput,
  Table,
  Text,
  Pagination,
  Button,
  UnstyledButton,
  Center,
  Group,
} from "@mantine/core";
import { useState } from "react";
import Image from "next/image";
import { Trash, ChevronDown, ChevronUp, Selector } from "tabler-icons-react";
import { TypesEnum } from "../../src/generated/graphql";
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

export const PokemonTable = ({ data, rowFuntion, functionHeader }) => {
  const [activePage, setPage] = useState(1);
  const [selectValue, setSelectValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (selectValue == null) {
      setSelectValue("");
    } else {
      setSelectValue(selectValue);
    }
  }, [selectValue]);

  useEffect(() => {
    setFilteredData(filterData(data));
    setPage(1);
  }, [data, searchValue, selectValue]);

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

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setFilteredData(sortData(filteredData, { sortBy: field, reversed }));
  };

  const filterData = (items) => {
    const searchQuery = searchValue.toLowerCase().trim();
    const selectQuery = selectValue.toLowerCase().trim();
    return items.filter(
      (pokemon) =>
        pokemon.species.includes(searchQuery) &&
        pokemon.types.toLowerCase().includes(selectQuery)
    );
  };

  const sortData = (
    data: RowData[],
    payload: { sortBy: keyof RowData | null; reversed: boolean }
  ) => {
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

  const tableHeaders = (
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
      <th>{functionHeader}</th>
    </tr>
  );

  const tableRows = paginate(filteredData, activePage, 10).items?.map(
    (element, i) => (
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
          <Button onClick={() => rowFuntion(element.species)}>
            <Trash />
          </Button>
        </td>
      </tr>
    )
  );

  return (
    <div>
      <Grid>
        <Grid.Col span={4}>
          <Select
            value={selectValue}
            onChange={setSelectValue}
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
            placeholder="Search anything"
          />
        </Grid.Col>
      </Grid>

      <Table striped highlightOnHover>
        <thead>{tableHeaders}</thead>
        <tbody>
          {tableRows.length > 0 ? (
            tableRows
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
        total={Math.ceil(filteredData.length / 10)}
      />
    </div>
  );
};
