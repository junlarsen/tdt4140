import {
  AppShell,
  Navbar,
  Header,
  Box,
  Text,
  Flex,
  Button,
  Group,
  Input,
  useMantineTheme,
  useMantineColorScheme,
  NavLink,
  Image,
} from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useLogout, useSession } from "../auth.js";
import { useForm } from "react-hook-form";

const Logo = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const colorScheme = useMantineColorScheme();
  const onSearchNavigate = (data) => {
    navigate(`/search?q=${data.query}`);
  };

  return (
    <Header height={60}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Flex
          align="center"
          columnGap="sm"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <Icon
            icon="material-symbols:menu-book-outline-sharp"
            width={40}
            height={40}
          />
          <Text component="p" fw={800} fs="xl" style={{ userSelect: "none" }}>
            IBDB
          </Text>
        </Flex>
        <Group>
          <Button
            variant="subtle"
            onClick={() => colorScheme.toggleColorScheme()}
          >
            <Icon icon="tabler:sun-moon" width={28} height={28} />
          </Button>
          <form onSubmit={handleSubmit(onSearchNavigate)}>
            <Flex columnGap="xs">
              <Input
                id="search-input-hack-dont-do-this-please"
                sx={{ width: 300 }}
                placeholder="Søk etter bok eller forfatter"
                {...register("query", {
                  required: true,
                  minLength: 1,
                })}
                icon={<Icon icon="mdi:search" width={20} height={20} />}
              />
              <Button type="submit">Søk</Button>
            </Flex>
          </form>
        </Group>
      </Group>
    </Header>
  );
};

const Links = () => {
  const theme = useMantineTheme();
  const session = useSession();
  const navigate = useNavigate();
  const links = [
    {
      icon: "mdi:format-list-numbered",
      href: "/",
      label: "Topplister",
      color: theme.colors.blue[4],
    },
  ];
  if (session !== null) {
    if (session.user.user_role === "a") {
      links.push(
        {
          icon: "mdi:book-plus",
          href: "/admin/books",
          label: "Legg til bøker",
          color: theme.colors.teal[4],
        },
        {
          icon: "mdi:book-plus",
          href: "/admin/genres",
          label: "Legg til sjangere",
          color: theme.colors.teal[4],
        },
        {
          icon: "mdi:book-plus",
          href: "/admin/authors",
          label: "Legg til forfattere",
          color: theme.colors.teal[4],
        },
      );
    } else {
      // links.push(
      //   {
      //     icon: "mdi:book-heart",
      //     href: "/my-favorites",
      //     label: "Mine favoritter",
      //     color: theme.colors.red[4],
      //   },
      //   {
      //     icon: "mdi:message-draw",
      //     href: "/my-reviews",
      //     label: "Mine anmeldelser",
      //     color: theme.colors.green[4],
      //   },
      //   {
      //     icon: "mdi:view-list",
      //     href: "/my-lists",
      //     label: "Mine lister",
      //     color: theme.colors.yellow[4],
      //   },
      // );
    }
  }

  return (
    <Box>
      {links.map((link) => (
        <NavLink
          key={link.href}
          onClick={() => navigate(link.href)}
          childrenOffset="xl"
          icon={
            <Icon width={40} color={link.color} height={40} icon={link.icon} />
          }
          label={<Text size="sm">{link.label}</Text>}
        />
      ))}
    </Box>
  );
};

const User = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const session = useSession();
  const logout = useLogout();
  const onLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${theme.colors.gray[2]}`,
        padding: theme.spacing.xs,
      }}
    >
      <Flex columnGap="xs" direction="row" align="center">
        {session !== null ? (
          <>
            <Flex columnGap="xs">
              <Icon width={40} height={40} icon="mdi:account-circle" />
              <Box>
                <Text size="sm" weight={500}>
                  {session.user.username} (
                  {session.user.user_role === "u" ? "Bruker" : "Administrator"})
                </Text>
                <Text color="dimmed" size="xs">
                  {session.user.email}
                </Text>
              </Box>
            </Flex>
            <Button onClick={() => onLogoutClick()}>Logg ut</Button>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/login")}>Logg inn</Button>
            <Button onClick={() => navigate("/registration")}>
              Registrer bruker
            </Button>
          </>
        )}
      </Flex>
    </Box>
  );
};

export const Layout = () => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar p="xs" width={{ base: 400 }}>
          <Navbar.Section grow mt="md">
            <Links />
          </Navbar.Section>
          <Navbar.Section>
            <Text color="dimmed">Annonsørinnhold</Text>
            <Image src="/kiwi.png" height={900} radius="md" fit="revert" />
          </Navbar.Section>
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
      }
      header={<Logo />}
    >
      <Outlet />
    </AppShell>
  );
};
