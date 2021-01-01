import React, { ComponentType, ReactNode } from 'react';
import Id from '../IdContext/Id';
import IdContext, { useIdContext } from '../IdContext';

const withIdContext: (
  context: IdContext<ReactNode>
) => ComponentType<{ id?: Id }> = (context) => {
  const Component = ({ id }: { id?: Id }) => (
    <div>
      {useIdContext(context, id)}
    </div>
  );

  Component.defaultProps = {
    id: null,
  };

  return Component;
};

export default withIdContext;
