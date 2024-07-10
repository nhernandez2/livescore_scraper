import { TeamDTO } from './TeamDTO';

describe('TeamDTO', () => {
  it('should create a TeamDTO instance with the provided values', () => {
    const id = 1;
    const externalId = 'ext-id';
    const name = 'Team Name';
    const location = 'Team Location';

    const team = new TeamDTO(id, externalId, name, location);

    expect(team.id).toBe(id);
    expect(team.external_id).toBe(externalId);
    expect(team.name).toBe(name);
    expect(team.location).toBe(location);
  });

  it('should create a TeamDTO instance from a database result', () => {
    const result = {
      id: 1,
      external_id: 'ext-id',
      name: 'Team Name',
      location: 'Team Location',
    };

    const team = TeamDTO.fromDbResult(result);

    expect(team.id).toBe(result.id);
    expect(team.external_id).toBe(result.external_id);
    expect(team.name).toBe(result.name);
    expect(team.location).toBe(result.location);
  });

  it('should return a JSON object without the external_id property', () => {
    const id = 1;
    const externalId = 'ext-id';
    const name = 'Team Name';
    const location = 'Team Location';

    const team = new TeamDTO(id, externalId, name, location);

    const json = team.toJSONWithoutExternalId();

    expect(json.id).toBe(id);
    expect(json.name).toBe(name);
    expect(json.location).toBe(location);
    expect(json.external_id).toBeUndefined();
  });
});