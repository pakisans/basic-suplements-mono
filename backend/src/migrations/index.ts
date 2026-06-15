import * as migration_20260325_222610 from './20260325_222610';
import * as migration_20260325_223736 from './20260325_223736';
import * as migration_20260329_221620 from './20260329_221620';
import * as migration_20260406_062532 from './20260406_062532';
import * as migration_20260520_113552 from './20260520_113552';
import * as migration_20260612_064927_add_split_hero from './20260612_064927_add_split_hero';
import * as migration_20260615_082744_add_category_sort_order from './20260615_082744_add_category_sort_order';

export const migrations = [
  {
    up: migration_20260325_222610.up,
    down: migration_20260325_222610.down,
    name: '20260325_222610',
  },
  {
    up: migration_20260325_223736.up,
    down: migration_20260325_223736.down,
    name: '20260325_223736',
  },
  {
    up: migration_20260329_221620.up,
    down: migration_20260329_221620.down,
    name: '20260329_221620',
  },
  {
    up: migration_20260406_062532.up,
    down: migration_20260406_062532.down,
    name: '20260406_062532',
  },
  {
    up: migration_20260520_113552.up,
    down: migration_20260520_113552.down,
    name: '20260520_113552',
  },
  {
    up: migration_20260612_064927_add_split_hero.up,
    down: migration_20260612_064927_add_split_hero.down,
    name: '20260612_064927_add_split_hero',
  },
  {
    up: migration_20260615_082744_add_category_sort_order.up,
    down: migration_20260615_082744_add_category_sort_order.down,
    name: '20260615_082744_add_category_sort_order'
  },
];
