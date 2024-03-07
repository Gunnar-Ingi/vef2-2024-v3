export type Database = {
  connectionString: string;
  logger: string;
}

export type DatabaseTeam = {
  teams: Array<Team>;
}

export type Team = {
  id: number;
  title?: string;
  slug?: string;
}
