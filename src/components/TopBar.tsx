import { Dispatch, SetStateAction } from "react";

import { Header, MediaQuery, Burger, useMantineTheme } from "@mantine/core";
import HeaderLogo from "./HeaderLogo";

type Props = {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
};

const TopBar = ({ openState, setOpenState }: Props) => {
  const theme = useMantineTheme();
  return (
    <Header
      height={60}
      p="xs"
      sx={(theme) => ({
        backgroundColor: theme.colors.blue[9],
        color: "white",
      })}
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {openState}
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={openState}
            onClick={() => setOpenState((o) => !o)}
            size="sm"
            color={theme.colors.gray[3]}
            mr="xl"
          />
        </MediaQuery>

        <HeaderLogo />
      </div>
    </Header>
  );
};

export default TopBar;
