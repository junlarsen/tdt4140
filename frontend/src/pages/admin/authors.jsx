import {
  Table,
  Button,
  Modal,
  Loader,
  Flex,
  Title,
  Text,
  TextInput,
} from "@mantine/core";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useCreateAuthorMutation, useListAuthorsQuery } from "../../client.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { createAuthorSchema } from "@gruppe-20/backend";
import { showNotification } from "@mantine/notifications";

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("id", {
    header: () => <Text>Id</Text>,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: () => <Text>Navn</Text>,
    cell: (info) => info.getValue(),
  }),
];

export const AdminAuthors = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { data = [], isLoading } = useListAuthorsQuery();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex direction="column" rowGap="md">
      <Title>Forfatteroversikt</Title>
      <Text>
        Her får du en oversikt over eksisterende forfattere, og muligheten til å
        legge til nye
      </Text>

      <Button onClick={() => setPopupVisible(true)}>Opprett ny</Button>
      {isPopupVisible && (
        <AdminAuthorsPopup onClose={() => setPopupVisible(false)} />
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <Table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Flex>
  );
};

const AdminAuthorsPopup = ({ onClose }) => {
  const { error, isSuccess, isError, mutate } = useCreateAuthorMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAuthorSchema),
  });

  const onFormSubmit = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Suksess",
        message: `Forfatteren har blitt opprettet`,
        color: "blue",
      });
      onClose();
    }
  }, [isSuccess, showNotification]);

  useEffect(() => {
    if (isError) {
      const isDuplicateNameError = error.response.status === 409;
      showNotification({
        title: "Feil oppsto",
        message: isDuplicateNameError
          ? "En forfatter med det oppgitte navnet eksisterer allerede"
          : `En ukjent feil oppsto: ${error.message}`,
        color: "red",
      });
    }
  }, [isError, error, showNotification]);

  return (
    <Modal opened title="Opprett ny forfatter" onClose={onClose}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Flex direction="column" gap="md">
          <TextInput
            {...register("name")}
            placeholder="navn"
            error={errors.name && <ErrorMessage errors={errors} name="name" />}
          />
          <Button type="submit">Opprett</Button>
        </Flex>
      </form>
    </Modal>
  );
};
