import { AppShell, Navbar, Header, Title } from "@mantine/core";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section>
            <Title>Home</Title>
          </Navbar.Section>
          <Navbar.Section>Administration</Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          {/* Header content */}
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};
