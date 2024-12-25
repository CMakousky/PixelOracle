import { RawgData } from "./RawgData";

export interface UserData {
  id: number;
  username: string;
  email: string;
  favorites: Array<RawgData>;
}
