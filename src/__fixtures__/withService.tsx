import React, { ComponentType, ReactNode } from 'react';
import Id from '../IdContext/Id';
import Service, { useService } from '../Service';

const withService: (
  service: Service<any, ReactNode>
) => ComponentType<{ id?: Id }> = (service) => {
  const Component = ({ id }: { id?: Id }) => (
    <div>
      {useService(service, id)}
    </div>
  );

  Component.defaultProps = {
    id: null,
  };

  return Component;
};

export default withService;
