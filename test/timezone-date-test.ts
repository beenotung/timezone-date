import { TimezoneDate } from '../src/timezone-date'

function assert(o: { expect: any; actual: any; name: string }) {
  if (o.expect !== o.actual) {
    console.error('Fail:', o)
    process.exit(1)
  } else {
    console.log('Pass:', o.name)
  }
}

const d = TimezoneDate.fromDate(new Date('2020-04-21T10:00:00.000Z'))

d.timezone = 0
assert({
  expect: 0,
  actual: d.getTimezoneOffset(),
  name: 'initial set timezone',
})

d.timezone = +8
assert({
  expect: 8 * -60,
  actual: d.getTimezoneOffset(),
  name: 'change timezone',
})

d.setTimezoneOffset(6 * -60)
assert({ expect: 6, actual: d.timezone, name: 'set timezone offset' })

d.timezone = +8
assert({ expect: 18, actual: d.getHours(), name: 'get hour' })

d.setHours(9)
assert({ expect: 9, actual: d.getHours(), name: 'set hour' })

d.timezone = +8
d.setHours(9)
d.timezone = +9
assert({ expect: 10, actual: d.getHours(), name: 'time zone shift on hours' })

d.timezone = +8
d.setHours(9, 0, 0, 0)
assert({
  expect: '9:00:00 AM',
  actual: d.toLocaleTimeString('en-US'),
  name: 'get original locale time string',
})
d.timezone = +9
assert({
  expect: '10:00:00 AM',
  actual: d.toLocaleTimeString('en-US'),
  name: 'time zone shift locale time string',
})

d.timezone = +8
d.setFullYear(2020, 4 - 1, 21)
d.setHours(6, 0, 0)
assert({
  expect: '4/21/2020',
  actual: d.toLocaleDateString('en-US'),
  name: 'get original locale date string',
})
d.timezone = 0
assert({
  expect: '4/20/2020',
  actual: d.toLocaleDateString('en-US'),
  name: 'time zone shift locale date string',
})

d.timezone = +8
d.setFullYear(2020, 4 - 1, 21)
d.setHours(6, 0, 0)
assert({
  expect: '4/21/2020, 6:00:00 AM',
  actual: d.toLocaleString('en-US'),
  name: 'get original locale string',
})
d.timezone = 0
assert({
  expect: '4/20/2020, 10:00:00 PM',
  actual: d.toLocaleString('en-US'),
  name: 'time zone shift locale string',
})

console.log('done.')
