import {
  oneOfType, string, number, symbol,
} from 'prop-types';

/**
 * Provider id type.
 * Using the id `null` specifies the closest Provider.
 */
type Id = string | number | symbol | null;

export default Id;

/** @ignore */
export const PropTypesId = oneOfType([string, number, symbol]);
