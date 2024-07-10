export class TeamDTO {
    id: number = 0;
    external_id: string = '';
    name: string = '';
    location: string = '';
  
    constructor(id: number, external_id: string, name: string, location: string) {
      this.id = id;
      this.external_id = external_id;
      this.name = name;
      this.location = location;
    }

    public static fromDbResult(result: any): TeamDTO {
      return new TeamDTO(result.id, result.external_id, result.name, result.location);
    }

    toJSONWithoutExternalId(): any {
      const { external_id, ...team } = this;
      return team;
    }
}