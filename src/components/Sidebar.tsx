import { Dispatch, SetStateAction } from "react";
import { Navbar } from "@mantine/core";
import { Home, Bell } from "tabler-icons-react";
import SidebarItem from "./SidebarItem";

type Props = {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
};

const Sidebar = ({ openState, setOpenState }: Props) => {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!openState}
      width={{ sm: 200 }}
    >
      <SidebarItem
        label="Home"
        icon={<Home />}
        url=""
        setOpenState={setOpenState}
      />
      <SidebarItem
        label="Watch List"
        icon={<Bell />}
        url="pokemonWatchList"
        setOpenState={setOpenState}
      />
    </Navbar>
  );
};

export default Sidebar;
