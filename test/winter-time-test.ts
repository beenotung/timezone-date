import { TimezoneDate } from '../src/timezone-date'
import { assert } from './utils'

// Test with IANA timezone identifier (handles DST automatically)
const date = new TimezoneDate()
date.timezone = 'America/New_York'

// Test summer time (June 1, 2025 - should be EDT, UTC-4)
const summerTime = new Date('2025-06-01T12:00:00Z') // UTC noon on June 1
date.setTime(summerTime.getTime())

assert({
  expect: '2025-06-01T12:00:00.000Z',
  actual: date.toISOString(),
  name: 'summer time UTC time',
})

assert({
  expect: 240,
  actual: date.getTimezoneOffset(),
  name: 'summer time offset should be 240 minutes (EDT, UTC-4)',
})

assert({
  expect: -4,
  actual: date.getTimezoneOffset() / -60,
  name: 'summer time offset in hours should be -4 (EDT)',
})

// Test winter time (December 1, 2025 - should be EST, UTC-5)
const winterTime = new Date('2025-12-01T12:00:00Z') // UTC noon on December 1
date.setTime(winterTime.getTime())

assert({
  expect: '2025-12-01T12:00:00.000Z',
  actual: date.toISOString(),
  name: 'winter time UTC time',
})

assert({
  expect: 300,
  actual: date.getTimezoneOffset(),
  name: 'winter time offset should be 300 minutes (EST, UTC-5)',
})

assert({
  expect: -5,
  actual: date.getTimezoneOffset() / -60,
  name: 'winter time offset in hours should be -5 (EST)',
})

// Compare with fixed offset (no DST handling)
const dateFixed = new TimezoneDate()
dateFixed.timezone = -5 // Fixed UTC-5

dateFixed.setTime(summerTime.getTime())
assert({
  expect: 300,
  actual: dateFixed.getTimezoneOffset(),
  name: 'fixed offset -5 should always be 300 minutes (no DST)',
})

dateFixed.setTime(winterTime.getTime())
assert({
  expect: 300,
  actual: dateFixed.getTimezoneOffset(),
  name: 'fixed offset -5 should always be 300 minutes (no DST)',
})
