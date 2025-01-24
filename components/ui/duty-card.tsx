'use client';

import { deleteDutyById, pinDuty } from '@/libs/db/actions/duty-actions';
import { IDuty } from '@/libs/models/duty-model';
import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Divider,
  Flex,
  Group,
  Menu,
  Space,
  Text
} from '@mantine/core';
import {
  IconCalendarOff,
  IconCalendarTime,
  IconClipboardCheck,
  IconDots,
  IconEdit,
  IconFlag,
  IconNotes,
  IconPin,
  IconPinned,
  IconPinnedOff,
  IconTrash,
  IconUsers
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DutyCardProps {
  duty: IDuty;
}

export default function DutyCard({ duty }: DutyCardProps) {
  const [dutyState, setDutyState] = useState(duty);
  const router = useRouter();
  const [loading, isLoading] = useState(false);

  const totalAssistants = duty.assistantList.length;
  const totalSections = duty.sectionList.length;
  const selectedMonth = dayjs(duty.monthConfig?.selectedDate).format('MMMM YYYY');

  const editDuty = async () => {
    isLoading(true);
    router.push(`/dashboard/duty-list/${duty.id}`);
  };

  const setNote = async () => {
    // TODO: Implement set note functionality
  };

  const handlePinDuty = async () => {
    setDutyState({ ...dutyState, pinned: true });
    await pinDuty(duty.id, true);
  };

  const handleUnpinDuty = async () => {
    setDutyState({ ...dutyState, pinned: false });
    await pinDuty(duty.id, false);
  };

  const deleteDuty = async () => {
    isLoading(true);
    await deleteDutyById(duty.id as string);
    isLoading(false);
  };

  return (
    <Card
      mx="auto"
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      onClick={editDuty}
      className="w-[350px] cursor-pointer transition-colors duration-300 hover:bg-cinder">
      <Flex justify="space-between" align={'center'} direction={'row'} wrap={'wrap'}>
        <Flex direction={'row'} gap={'sm'} align={'center'}>
          {dutyState.pinned && <IconPin size={24} color="orange" />}
          <Avatar color="blue" radius="md">
            <IconCalendarTime size={24} />
          </Avatar>
          <Text fw={700} fz="xl">
            {selectedMonth}
          </Text>
        </Flex>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon
              className="pointer-events-auto"
              loading={loading}
              onClick={e => e.stopPropagation()}
              variant="light"
              color="gray">
              <IconDots size="1rem" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={editDuty} leftSection={<IconEdit size={18} />}>
              Edit
            </Menu.Item>
            <Menu.Item onClick={setNote} leftSection={<IconNotes size={18} />}>
              Set Note
            </Menu.Item>
            {dutyState.pinned ? (
              <Menu.Item onClick={handleUnpinDuty} leftSection={<IconPinnedOff size={18} />}>
                Unpin
              </Menu.Item>
            ) : (
              <Menu.Item onClick={handlePinDuty} leftSection={<IconPinned size={18} />}>
                Pin
              </Menu.Item>
            )}
            <Divider />
            <Menu.Item onClick={deleteDuty} color="red" leftSection={<IconTrash size={18} />}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>

      <Space h={'xs'} />

      <Flex direction={'column'} gap={'xs'}>
        <Group align="center" wrap="nowrap" gap={'sm'} className="rounded-md">
          <IconUsers size={18} className="text-gray-500" />
          <Text fz="sm" c={'dimmed'}>
            Assistants:
          </Text>
          <Text fw={500}>{totalAssistants}</Text>
        </Group>

        <Group align="center" wrap="nowrap" gap={'sm'} className="rounded-md">
          <IconFlag size={18} className="text-gray-500" />
          <Text fz="sm" c={'dimmed'}>
            Sections:
          </Text>
          <Text fw={500}>{totalSections}</Text>
          {duty.sectionList.slice(0, 3).map(section => (
            <Badge
              className="pointer-events-none"
              key={section.id}
              color={section.color}
              size="xs"
              miw={40}
              radius="sm">
              {section.name}
            </Badge>
          ))}
          {duty.sectionList.length > 3 && (
            <Badge size="xs" radius="sm" color="gray" w={40}>
              + {duty.sectionList.length - 3}
            </Badge>
          )}
        </Group>

        <Group align="center" wrap="nowrap" gap={'sm'}>
          <IconCalendarOff size={18} className="text-gray-500" />
          <Text fz="sm" c={'dimmed'}>
            Rest Days:
          </Text>
          <Text fw={500}>{duty.restDayCount}</Text>
        </Group>

        <Group align="center" wrap="nowrap" gap={'sm'}>
          <IconClipboardCheck size={18} className="text-gray-500" />
          <Text fz="sm" c={'dimmed'}>
            Scheduled:
          </Text>
          <Text fw={500}>{duty.selectedDays.length}</Text>
        </Group>
      </Flex>
    </Card>
  );
}
