import React, { ComponentType, ReactNode } from 'react';
import Id from '../IdContext/Id';
import Service, { useService } from '../Service';

const withService: (
  service: Service<any, ReactNode>
) => ComponentType<{ id?: Id }> = (service) => ({ id = null }) => (
  <div>
    {useService(service, id)}
  </div>
);

export default withService;
