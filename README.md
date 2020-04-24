# timezone-date
Enhancement of Date class with better timezone support.

[![npm Package Version](https://img.shields.io/npm/v/timezone-date.svg?maxAge=3600)](https://www.npmjs.com/package/timezone-date)

## Features
- Compliant to `Date` methods
- Allow changing timezone anytime
- Tiny code base - 3.8KB minified

## Example
```typescript
import { TimezoneDate } from 'timezone-date'

const d = TimezoneDate.fromDate(new Date('2020-04-21T10:00:00.000Z'))

d.timezone = 0
d.getHours() // 10

d.timezone = +8
d.getHours() // 18

d.getTimezoneOffset() // -480 (in mintes, same format as Native Date)

d.setHours(9)
d.timezone++
d.getHours() // 10
d.toLocaleTimeString() // '10:00:00 AM'
```

## Installation
```bash
npm i timezone-date
```
## Construction
```typescript
import { TimezoneDate } from 'timezone-date'

/* custom timezone */
new TimezoneDate(Date.now(), {timezone: +8})

/* default timezone (in the environment) */
new TimezoneDate()                 // current time
new TimezoneDate(Date.now())
TimezoneDate.fromTime(Date.now())
TimezoneDate.fromDate(new Date())
TimezoneDate.from(Date.now())      // from Date or timestamp
```

## License
This is free open sourced software (FOSS), with [BSD 2-Clause License](./LICENSE)
