export class Subscription {
  id: number;
  team_id: number;
  user_id: number;

  constructor(id: number, team_id: number,  user_id: number) {
    this.id = id;
    this.team_id = team_id;
    this.user_id = user_id;
  }
}