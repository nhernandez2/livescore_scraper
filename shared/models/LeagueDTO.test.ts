import { LeagueDTO } from './LeagueDTO';

describe('LeagueDTO', () => {
  it('should create a LeagueDTO instance with the provided values', () => {
    const id = 1;
    const externalId = 'ext-id';
    const name = 'League Name';
    const nameFormat = 'League Name Format';
    const location = 'League Location';

    const league = new LeagueDTO(id, externalId, name, nameFormat, location);

    expect(league.id).toBe(id);
    expect(league.external_id).toBe(externalId);
    expect(league.name).toBe(name);
    expect(league.name_format).toBe(nameFormat);
    expect(league.location).toBe(location);
  });

  it('should create a LeagueDTO instance from a database result', () => {
    const result = {
      id: 1,
      external_id: 'ext-id',
      name: 'League Name',
      name_format: 'League Name Format',
      location: 'League Location',
    };

    const league = LeagueDTO.fromDbResult(result);

    expect(league.id).toBe(result.id);
    expect(league.external_id).toBe(result.external_id);
    expect(league.name).toBe(result.name);
    expect(league.name_format).toBe(result.name_format);
    expect(league.location).toBe(result.location);
  });

  it('should return a JSON object without the external_id property', () => {
    const id = 1;
    const externalId = 'ext-id';
    const name = 'League Name';
    const nameFormat = 'League Name Format';
    const location = 'League Location';

    const league = new LeagueDTO(id, externalId, name, nameFormat, location);

    const json = league.toJSONWithoutExternalId();

    expect(json.id).toBe(id);
    expect(json.name).toBe(name);
    expect(json.name_format).toBe(nameFormat);
    expect(json.location).toBe(location);
    expect(json.external_id).toBeUndefined();
  });
});
