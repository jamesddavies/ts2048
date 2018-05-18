import Tile from './Tile';

export type TileArray = (Tile|null)[];

export type GridArray = TileArray[];

export type Modifiers = {[key: string]: string};

export type Position = {[key: string]: number};

export type CellArray = Position[];