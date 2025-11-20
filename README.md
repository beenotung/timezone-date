# timezone-date.ts

Enhancement of Date class with better timezone support.

[![npm Package Version](https://img.shields.io/npm/v/timezone-date.ts)](https://www.npmjs.com/package/timezone-date.ts)
[![npm Package Version](https://img.shields.io/bundlephobia/min/timezone-date.ts)](https://bundlephobia.com/package/timezone-date.ts)
[![npm Package Version](https://img.shields.io/bundlephobia/minzip/timezone-date.ts)](https://bundlephobia.com/package/timezone-date.ts)

## Features

- Compliant to `Date` methods
- Allow changing timezone anytime
- Support both numeric timezone offsets and IANA timezone identifiers (e.g., "America/New_York")
- Automatic Daylight Saving Time (DST) handling with IANA timezones
- Typescript support
- Tiny code base (below 1KB minizipped)

## Example

Jump between timezones:

```typescript
import { TimezoneDate } from 'timezone-date.ts'

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

Set a specific time (e.g. from UI input)

```typescript
let date = new TimezoneDate()
date.timezone = +8
date.setFullYear(2020, 11 - 1, 28)
date.setHours(9, 2, 38)
console.log(date.toString()) // Sat Nov 28 2020 09:02:38 GMT+0800 (Hong Kong Standard Time)
```

Using IANA timezone identifiers with automatic DST handling:

```typescript
import { TimezoneDate } from 'timezone-date.ts'

let date = new TimezoneDate()
date.timezone = 'America/New_York' // IANA timezone identifier

// Summer time (EDT, UTC-4)
date.setTime(new Date('2025-06-01T12:00:00Z').getTime())
date.getTimezoneOffset() / 60 // -4 (EDT)
date.toLocaleString('en-US') // "6/1/2025, 8:00:00 AM"

// Winter time (EST, UTC-5)
date.setTime(new Date('2025-12-01T12:00:00Z').getTime())
date.getTimezoneOffset() / 60 // -5 (EST)
date.toLocaleString('en-US') // "12/1/2025, 7:00:00 AM"
```

Using the exported utility function:

```typescript
import { getTimezoneOffsetForIANA } from 'timezone-date.ts'

const time = new Date('2025-06-01T12:00:00Z').getTime()
const offset = getTimezoneOffsetForIANA('America/New_York', time)
console.log(offset) // -4 (hours, EDT in summer)
```

## Installation

```bash
npm i timezone-date.ts
```

## Construction

```typescript
import { TimezoneDate } from 'timezone-date.ts'

/* custom timezone (numeric offset) */
new TimezoneDate(Date.now(), { timezone: +8 })

/* custom timezone (IANA identifier) */
new TimezoneDate(Date.now(), { timezone: 'America/New_York' })

/* default timezone (in the environment) */
new TimezoneDate() // current time
new TimezoneDate(Date.now())
TimezoneDate.fromTime(Date.now())
TimezoneDate.fromDate(new Date())
TimezoneDate.from(Date.now()) // from Date or timestamp
```

## Timezone Format

The `timezone` property accepts:

- **Numeric offset** (in hours): `+8`, `-5`, `0`, etc.
  - Fixed offset, does not handle DST automatically
- **IANA timezone identifier**: `"America/New_York"`, `"Asia/Hong_Kong"`, `"Europe/London"`, etc.
  - Automatically handles Daylight Saving Time (DST)
  - Uses the browser's/Node.js's built-in timezone database

## Exported Functions

### `getTimezoneOffsetForIANA(timezone: string, time: number): number`

Get the timezone offset in hours for a given IANA timezone identifier at a specific time.

```typescript
import { getTimezoneOffsetForIANA } from 'timezone-date.ts'

const time = new Date('2025-06-01T12:00:00Z').getTime()
const offset = getTimezoneOffsetForIANA('America/New_York', time)
// Returns -4 (EDT in summer) or -5 (EST in winter)
```

## License

This is free open sourced software (FOSS), with [BSD 2-Clause License](./LICENSE)
