import Tile from './Tile';

export type CellArray = Position[];

export type GridArray = TileArray[];

export type TileArray = (Tile|null)[];

export type KeyMap = {[key: number]: number};

export type Modifiers = {[key: string]: number};

export type Position = {[key: string]: number};