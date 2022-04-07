import { Currencies } from "../../localisation";

export interface IGame {
  _id?: string;
  name: string;
  imageUrl: string;
  slug: string;
  start: Date;
  end: Date;
  confirmed: boolean;
  price: GamePrices;
}

export type GamePrices = {
  [key in Currencies]: string;
};
