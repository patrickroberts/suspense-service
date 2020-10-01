import { oneOfType, string, number, symbol } from 'prop-types';

type Id = string | number | symbol | null;

export default Id;

/** @ignore */
export const PropTypesId = oneOfType([string, number, symbol]);
