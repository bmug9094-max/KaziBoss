import { CARDS_EN_1 } from './cards1';
import { CARDS_EN_2 } from './cards2';
import { CARDS_EN_3 } from './cards3';
import type { CardText } from './types';

export const CARDS_EN: Record<string, CardText> = { ...CARDS_EN_1, ...CARDS_EN_2, ...CARDS_EN_3 };
