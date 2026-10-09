import {mkdtempSync, writeFileSync} from 'fs';
import {tmpdir} from 'os';
import path from 'path';
import {load, locale} from '../bin/load.js';

describe('bin/load', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'vl-load-'));
  const numberLocale = {decimal: ',', thousands: '.', grouping: [3], currency: ['', ' €']};
  const numberFile = path.join(dir, 'number-locale.json');
  writeFileSync(numberFile, JSON.stringify(numberLocale));

  describe('load', () => {
    it('should parse a JSON file into an object', () => {
      expect(load(numberFile, 'format')).toEqual(numberLocale);
    });

    it('should throw a readable error for a missing file', () => {
      expect(() => load(path.join(dir, 'missing.json'), 'config')).toThrow(/Could not load --config file/);
    });
  });

  describe('locale', () => {
    it('should only set the formats that were given', () => {
      expect(locale({})).toEqual({});
      expect(locale({format: numberFile})).toEqual({number: numberLocale});
    });

    it('should not set number or time to null', () => {
      const result = locale({});
      expect('number' in result).toBe(false);
      expect('time' in result).toBe(false);
    });
  });
});
