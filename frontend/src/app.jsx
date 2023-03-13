import { StrictMode, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  ColorSchemeProvider,
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Registration } from "./pages/registration.jsx";
import { Layout } from "./pages/layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { AdminGenres } from "./pages/admin/genres";
import { AdminAuthors } from "./pages/admin/authors.jsx";
import { AdminBooks } from "./pages/admin/books.jsx";
import { Search } from "./pages/search.jsx";
import { Book } from "./pages/book.jsx";
import { useColorScheme } from "@mantine/hooks";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/search" element={<Search />} />
      <Route path="admin" element={<Outlet />}>
        <Route path="genres" element={<AdminGenres />} />
        <Route path="authors" element={<AdminAuthors />} />
        <Route path="books" element={<AdminBooks />} />
      </Route>
      <Route path="books" element={<Outlet />}>
        <Route path=":book" element={<Book />} />
      </Route>
    </Route>,
  ),
);

const queryClient = new QueryClient();

const MantineColorSchemeProvider = ({ children }) => {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {children}
    </ColorSchemeProvider>
  );
};

const MantineBaseProvider = ({ children }) => {
  const { colorScheme } = useMantineColorScheme();

  return (
    <MantineProvider
      withGlobalStyles
      theme={{
        colorScheme,
      }}
      withNormalizeCSS
    >
      {children}
    </MantineProvider>
  );
};

export const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineColorSchemeProvider>
          <MantineBaseProvider>
            <NotificationsProvider>
              <RouterProvider router={router}>
                <Outlet />
              </RouterProvider>
            </NotificationsProvider>
          </MantineBaseProvider>
        </MantineColorSchemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};
