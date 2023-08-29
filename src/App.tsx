import { ActionIcon, Button, Group, MantineProvider } from "@mantine/core";
import useThemeDetector from "react-theme-hook";
import { Icon123 } from "@tabler/icons-react";
import Shell from "./components/Shell";
import Logo from "./assets/robot_arm.svg";

function App() {
  const isDarkMode = useThemeDetector();
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: isDarkMode ? "dark" : "light" }}
    >
      <Shell
        pageNav={
          <>
            <Button>Button A</Button>
            <Button>Button A</Button>
            <Button>Button A</Button>
          </>
        }
        siteNav={
          <Group position="apart" sx={{ flexGrow: 1 }}>
            <Group>
              <Button>Button A</Button>
              <Button>Button A</Button>
              <ActionIcon>
                <Icon123 />
              </ActionIcon>
            </Group>
            <Group>
              <Button>Button A</Button>
            </Group>
          </Group>
        }
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img src={Logo} />
          <p style={{ fontWeight: "bold", fontSize: "5rem" }}>Coming soon</p>
        </div>
      </Shell>
    </MantineProvider>
  );
}

export default App;
