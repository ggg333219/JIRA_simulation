import React from 'react';

export const DragDropContext: React.FC<{ onDragEnd?: (result:any)=>void; children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export type DropResult = any;

export const Droppable: React.FC<any> = ({ children, ...props }) => {
  // children can be a function
  const provided = {
    droppableProps: {},
    innerRef: (el: any) => {},
    placeholder: null,
  };
  if (typeof children === 'function') return <>{children(provided)}</>;
  return <>{children}</>;
};

export const Draggable: React.FC<any> = ({ children }) => {
  const provided = {
    draggableProps: {},
    dragHandleProps: {},
    innerRef: (el: any) => {},
  };
  if (typeof children === 'function') return <>{children(provided)}</>;
  return <>{children}</>;
};

export default DragDropContext;
