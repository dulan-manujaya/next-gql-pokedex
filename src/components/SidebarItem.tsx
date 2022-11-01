import React, { ReactElement, Dispatch, SetStateAction } from "react";
import { Box, Title } from "@mantine/core";
import Link from "next/link";

type Props = {
  label: string;
  icon: ReactElement;
  url: string;
  setOpenState: Dispatch<SetStateAction<boolean>>;
};

const SidebarItem = ({ label, icon, url, setOpenState }: Props) => {
  return (
    <Link href={`/${url}`} passHref>
      <Box
        sx={{ display: "flex", margin: "0.5rem 0", cursor: "pointer" }}
        onClick={() => setOpenState((o) => !o)}
      >
        {icon}
        <Title order={5} ml={10}>
          {label}
        </Title>
      </Box>
    </Link>
  );
};

export default SidebarItem;
