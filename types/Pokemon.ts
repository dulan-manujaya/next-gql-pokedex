export interface PokemonInterface {
  __typename?: "Pokemon";
  species: string;
  sprite: string;
  types: { __typename?: "PokemonType"; name: string }[];
}
