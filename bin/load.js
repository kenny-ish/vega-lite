// from vega-cli

import path from 'path';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

// load a JSON file, or a JS file that exports an object
export function load(file, flag) {
  try {
    const value = require(path.resolve(file));
    return value?.[Symbol.toStringTag] === 'Module' ? value.default : value;
  } catch (err) {
    throw new Error(`Could not load --${flag} file "${file}": ${err.message.split('\n')[0]}`, {cause: err});
  }
}

// locale options, only set the number/time formats that were given so that
// the spec's own config.locale is not overwritten by null values
export function locale(arg) {
  const result = {};
  if (arg.format) {
    result.number = load(arg.format, 'format');
  }
  if (arg.timeFormat) {
    result.time = load(arg.timeFormat, 'timeFormat');
  }
  return result;
}
