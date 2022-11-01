import { useRouter } from "next/router";
import { Text } from "@mantine/core";
import { Pokeball } from "tabler-icons-react";

const HeaderLogo = () => {
  const router = useRouter();

  return (
    <div
      style={{ display: "flex", cursor: "pointer" }}
      onClick={() => {
        router.push(`/`);
      }}
    >
      <Pokeball />
      <Text ml={10} size="md">
        GraphQL Pokedex
      </Text>
    </div>
  );
};

export default HeaderLogo;
