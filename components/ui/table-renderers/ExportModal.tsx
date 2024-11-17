import { IAssistant } from '@/app/_models/IAssistant';
import { ISection } from '@/app/_models/ISection';
import { Button, Modal, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FC, useContext, useMemo } from 'react';
import { NobetContext } from './NobetScheduler';

interface IExportModal {
  assistantList: IAssistant[];
  sectionList: ISection[];
}

export const ExportModal: FC<IExportModal> = ({ assistantList, sectionList }) => {
  const { monthConfig } = useContext(NobetContext);
  const [opened, { open, close }] = useDisclosure(false);

  const headerData = useMemo(() => {
    return ['', ...sectionList.map(s => s.name)];
  }, [sectionList]);

  const tableData = useMemo(() => {
    const data: string[][] = Array(monthConfig.datesInMonth)
      .fill(null)
      .map((_, index) => [String(index + 1), ...Array(sectionList.length).fill('')]);

    for (const assistant of assistantList) {
      const days = Object.keys(assistant.selectedDays.days).map(i => Number(i));
      for (const dayIndex of days) {
        const sectionIndex = headerData.findIndex(
          h => h === assistant.selectedDays.days[dayIndex].name
        );
        data[dayIndex - 1][sectionIndex] = assistant.name;
      }
    }

    return data;
  }, [assistantList, sectionList]);

  const headers = (
    <Table.Tr>
      {headerData.map((s, i) => (
        <Table.Th key={`header-${i}`} className={`bg-onyx text-center ${i === 0 && 'w-4'}`}>
          {s}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = tableData.map((row: string[]) => (
    <Table.Tr key={`row-${row[0]}`}>
      {row.map((cell, i) => (
        <Table.Th key={`cell-${i}`} className={`text-center ${i === 0 && 'w-4 bg-onyx'}`}>
          {cell}
        </Table.Th>
      ))}
    </Table.Tr>
  ));

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
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Modal>
      <Button onClick={open}>Export</Button>
    </>
  );
};
