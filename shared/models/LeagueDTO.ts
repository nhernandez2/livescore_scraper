export class LeagueDTO {
    id: number;
    external_id: string;
    name: string;
    name_format: string;
    location: string;
  
    constructor(id: number, external_id: string, name: string, name_format: string, location: string) {
      this.id = id;
      this.external_id = external_id;
      this.name = name;
      this.name_format = name_format;
      this.location = location;
    }

    public static fromDbResult(result: any): LeagueDTO {
      return new LeagueDTO(result.id, result.external_id, result.name, result.name_format, result.location);
    }

    toJSONWithoutExternalId(): any {
      const { external_id, ...league } = this;
      return league;
    }
}