import React, { ComponentType, ReactNode } from 'react';
import Id from '../IdContext/Id';
import IdContext, { useIdContext } from '../IdContext';

const withIdContext: (
  context: IdContext<ReactNode>
) => ComponentType<{ id?: Id }> = (context) => ({ id = null }) => (
  <div>
    {useIdContext(context, id)}
  </div>
);

export default withIdContext;
