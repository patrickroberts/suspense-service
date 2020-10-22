import React, { ReactNode } from 'react';

const mockRender = jest.fn((value: ReactNode) => (
  <span>
    {value}
  </span>
));

export default mockRender;
