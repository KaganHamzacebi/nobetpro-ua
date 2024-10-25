'use client';

import { IDefaultAssistant } from '@/libs/models/IAssistant';
import classes from '@/styles/AssistantDndList.module.scss';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { rem, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { IconGripVertical } from '@tabler/icons-react';
import cx from 'clsx';

interface IAssistantDNDList {
  assistantList: IDefaultAssistant[];
}

export default function AssistantDNDList({ assistantList }: Readonly<IAssistantDNDList>) {
  const [state, handlers] = useListState(assistantList ?? []);

  const items = state.map((item, index) => (
    <Draggable key={item.name} index={index} draggableId={item.name}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          ref={provided.innerRef}
          {...provided.draggableProps}>
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </div>
          <Text>{item.name}</Text>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) =>
        handlers.reorder({ from: source.index, to: destination?.index ?? 0 })
      }>
      <Droppable droppableId="dnd-list" direction="vertical">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
