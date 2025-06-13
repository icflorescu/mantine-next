import type { DraggableProvided } from '@hello-pangea/dnd';
import { Center } from '@mantine/core';
import { IconGripVertical } from '@tabler/icons-react';
import classes from './DragHandle.module.css';

export type DragHandleProps = {
  provided: DraggableProvided;
};

export function DragHandle({ provided }: DragHandleProps) {
  return (
    <Center className={classes.root} {...provided.dragHandleProps}>
      <IconGripVertical size={16} />
    </Center>
  );
}
