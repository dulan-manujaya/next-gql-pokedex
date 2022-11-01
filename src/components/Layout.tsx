import React, { useState } from "react";
import Head from "next/head";
import { AppShell } from "@mantine/core";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout({ children }) {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <Head>
        <title>GraphQL Pokedex</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <AppShell
        padding="md"
        navbarOffsetBreakpoint="sm"
        fixed
        navbar={<Sidebar openState={opened} setOpenState={setOpened} />}
        header={<TopBar openState={opened} setOpenState={setOpened} />}
        styles={(theme) => ({
          main: {
            backgroundColor: theme.colors.gray[0],
          },
        })}
      >
        {children}
      </AppShell>
    </div>
  );
}
