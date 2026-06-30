import { getTimezoneOffsetForIANA } from '../src/timezone-date'
import { assert } from './utils'

assert({
  actual: getTimezoneOffsetForIANA(
    'America/New_York',
    new Date('2025-06-01T12:00:00Z').getTime(),
  ),
  expect: -4,
  name: 'summer time offset should be -4 (EDT, UTC-4)',
})

assert({
  actual: getTimezoneOffsetForIANA(
    'America/New_York',
    new Date('2025-12-01T12:00:00Z').getTime(),
  ),
  expect: -5,
  name: 'winter time offset should be -5 (EST, UTC-5)',
})

assert({
  actual: getTimezoneOffsetForIANA(
    'Asia/Hong_Kong',
    new Date('2025-06-01T12:00:00Z').getTime(),
  ),
  expect: 8,
  name: 'summer time offset should be 8 (HKT, UTC+8)',
})

assert({
  actual: getTimezoneOffsetForIANA(
    'Asia/Hong_Kong',
    new Date('2025-12-01T12:00:00Z').getTime(),
  ),
  expect: 8,
  name: 'winter time offset should be 8 (HKT, UTC+8)',
})
