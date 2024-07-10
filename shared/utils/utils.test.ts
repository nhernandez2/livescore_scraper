import { format } from 'date-fns';
import { isRunningInDocker, getDateFromString, getRealDateString } from './utils';

describe('isRunningInDocker', () => {
  it('should return true when IS_DOCKER environment variable is set to "true"', () => {
    process.env.IS_DOCKER = 'true';
    expect(isRunningInDocker()).toBe(true);
  });

  it('should return false when IS_DOCKER environment variable is not set or set to any other value', () => {
    process.env.IS_DOCKER = 'false';
    expect(isRunningInDocker()).toBe(false);

    process.env.IS_DOCKER = '';
    expect(isRunningInDocker()).toBe(false);

    delete process.env.IS_DOCKER;
    expect(isRunningInDocker()).toBe(false);
  });
});

describe('getDateFromString', () => {
  it('should return a Date object with the correct date and time when date is Today', () => {
    const date = getDateFromString('Today', '20:00');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(new Date().getFullYear());
    expect(date.getMonth()).toBe(new Date().getMonth());
    expect(date.getDate()).toBe(new Date().getDate());
    expect(date.getHours()).toBe(20);
    expect(date.getMinutes()).toBe(0);
  });

  it('should return a Date object with the correct date and time', () => {
    const date = getDateFromString('13 Jul', '20:00');

    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(new Date().getFullYear());
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(13);
    expect(date.getHours()).toBe(20);
    expect(date.getMinutes()).toBe(0);
  });
});

describe('getRealDateString', () => {
  it('should return the current date formatted as "dd MMM" when the argument is "Today"', () => {
    const today = new Date();
    const expected = format(today, 'dd MMM');
    expect(getRealDateString('Today')).toBe(expected);
  });

  it('should return the same date string when the argument is not "Today"', () => {
    const date = '01 Jan';
    expect(getRealDateString(date)).toBe(date);
  });
});
