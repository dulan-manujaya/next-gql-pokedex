import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import Image from "next/image";
import {
  ListDetails,
  ChevronDown,
  ChevronUp,
  Selector,
} from "tabler-icons-react";
import { TypesEnum } from "../generated/graphql";
import { PokemonInterface } from "../../types/Pokemon";

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

interface RowData {
  species: string;
}

type Props = {
  data: PokemonInterface[];
  rowFunction: (species: string) => void;
  functionHeader: string;
  funcIcon: JSX.Element;
};

export const PokemonTable = ({
  data,
  rowFunction,
  functionHeader,
  funcIcon,
}: Props) => {
  const router = useRouter();
  const [activePage, setPage] = useState(1);
  const [selectValue, setSelectValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (selectValue == null) {
      setSelectValue("");
    }
  }, [selectValue]);

  useEffect(() => {
    setFilteredData(filterData(data));
    setPage(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchValue, selectValue]);

  const navigateToDetailPage = (species: string) => {
    router.push(`/pokemon/${species}`);
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

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setFilteredData(sortData(filteredData, { sortBy: field, reversed }));
  };

  const filterData = (items: PokemonInterface[]) => {
    let tempArr = items;

    const searchQuery = searchValue.toLowerCase().trim();
    const selectQuery = selectValue.toLowerCase().trim();

    tempArr = tempArr.filter((x) => {
      return x.types.some((ele) => ele.name.toLowerCase().match(selectQuery));
    });

    tempArr = tempArr.filter((x) => {
      return (
        x.types.some((ele) => ele.name.toLowerCase().includes(searchQuery)) ||
        x.species.toLowerCase().includes(searchQuery)
      );
    });

    return tempArr;
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

  const paginate = (items: PokemonInterface[], page = 1, perPage = 10) => {
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
      <th>Type</th>
      <th>More Details</th>
      <th>{functionHeader}</th>
    </tr>
  );

  const tableRows = paginate(filteredData, activePage, 10).items?.map(
    (element: PokemonInterface) => (
      <tr key={element.species}>
        <td>
          <Image
            src={element.sprite}
            height={50}
            width={50}
            alt={element.species}
          />
        </td>
        <td>{element.species}</td>
        <td>{element.types.map((element) => element.name).join(", ")}</td>
        <td>
          <Button onClick={() => navigateToDetailPage(element.species)}>
            <ListDetails />
          </Button>
        </td>
        <td>
          <Button onClick={() => rowFunction(element.species)}>
            {funcIcon}
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
              <td colSpan={5}>
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
