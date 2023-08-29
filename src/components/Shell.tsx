import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Header,
  Image,
  MediaQuery,
  Navbar,
  Stack,
} from "@mantine/core";
import { ReactElement, ReactNode, useCallback, useState } from "react";
import Logo from "../assets/robot_arm.svg";

interface ShellProps {
  pageNav?: ReactElement;
  siteNav?: ReactElement;
  children?: ReactNode;
}

export default function Shell({ pageNav, siteNav, children }: ShellProps) {
  const [pageNavOpen, setPageNavOpen] = useState(false);
  const handleTogglePageNav = useCallback(() => setPageNavOpen((p) => !p), []);

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!pageNavOpen}
          width={{ sm: 200, lg: 300 }}
        >
          <Stack>{pageNav}</Stack>
        </Navbar>
      }
      header={
        <Header height={60} p="xs" pl="xl">
          <Group h="100%">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={pageNavOpen}
                onClick={handleTogglePageNav}
                size="sm"
              />
            </MediaQuery>
            <ActionIcon>
              <Image src={Logo} />
            </ActionIcon>
            {siteNav}
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
