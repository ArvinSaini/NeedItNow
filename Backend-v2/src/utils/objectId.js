import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

/** Params schema for a single id param, e.g. idParams('userId') → { userId: objectId } */
export const idParams = (name) => z.object({ [name]: objectId });
