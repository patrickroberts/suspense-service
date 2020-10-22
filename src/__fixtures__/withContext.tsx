import React, { ComponentType, ReactNode } from 'react';
import Id from '../Context/Id';
import Context, { useContext } from '../Context';

const withContext: (
  context: Context<ReactNode>
) => ComponentType<{ id?: Id }> = (context) => ({ id = null }) => (
  <div>
    {useContext(context, id)}
  </div>
);

export default withContext;
