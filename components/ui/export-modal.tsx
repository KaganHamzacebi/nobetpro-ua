import { useDutyStore } from '@/libs/stores/use-duty-store';
import { Button, Modal, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FC, useMemo } from 'react';

export default function ExportModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const sectionList = useDutyStore.use.sectionList();
  const assistantList = useDutyStore.use.assistantList();

  const headerData = useMemo(() => {
    return ['', ...sectionList.map(s => s.name)];
  }, [sectionList]);

  const tableData = useMemo(() => {
    return [];
  }, []);

  const headers = (
    <Table.Tr>
      {headerData.map((s, i) => (
        <Table.Th key={`${s}-${i}`} className={`bg-onyx text-center ${i === 0 && 'w-4'}`}>
          {s}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const Row: FC<{ row: string[] }> = ({ row }) => (
    <Table.Tr key={`row-${row[0]}`}>
      {row.map((cell, i) => (
        <Table.Th key={`${cell}-${i}`} className={`text-center ${i === 0 && 'w-4 bg-onyx'}`}>
          {cell}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  return (
    <>
      <Modal
        title="Duty List"
        size="70%"
        opened={opened}
        onClose={close}
        transitionProps={{ transition: 'fade', duration: 200 }}
        centered>
        <Table
          highlightOnHover
          withTableBorder
          withColumnBorders
          stickyHeader
          stickyHeaderOffset={60}>
          <Table.Thead>{headers}</Table.Thead>
          <Table.Tbody>
            {tableData.map(row => (
              <Row key={row[0]} row={row} />
            ))}
          </Table.Tbody>
        </Table>
      </Modal>
      <Button onClick={open} disabled={sectionList.length === 0 || assistantList.length === 0}>
        Export
      </Button>
    </>
  );
}
