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
import { useCreateGenreMutation, useListGenresQuery } from "../../client.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { createGenreSchema } from "@gruppe-20/backend";
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

export const AdminGenres = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const { data = [], isLoading } = useListGenresQuery();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Flex direction="column" rowGap="md">
      <Title>Sjangeroversikt</Title>
      <Text>
        Her får du en oversikt over eksisterende sjangere, og muligheten til å
        legge til nye
      </Text>

      <Button onClick={() => setPopupVisible(true)}>Opprett ny</Button>
      {isPopupVisible && (
        <AdminGenresPopup onClose={() => setPopupVisible(false)} />
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

const AdminGenresPopup = ({ onClose }) => {
  const { error, isSuccess, isError, mutate } = useCreateGenreMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createGenreSchema),
  });

  const onFormSubmit = (data) => mutate(data);

  useEffect(() => {
    if (isSuccess) {
      showNotification({
        title: "Suksess",
        message: `Sjangeren har blitt opprettet`,
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
          ? "En sjanger med det oppgitte navnet eksisterer allerede"
          : `En ukjent feil oppsto: ${error.message}`,
        color: "red",
      });
    }
  }, [isError, error, showNotification]);

  return (
    <Modal opened title="Opprett ny sjanger" onClose={onClose}>
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
