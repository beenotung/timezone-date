const MILLISECOND = 1
const SECOND = MILLISECOND * 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

function fromDateTimezoneOffset(offset: number) {
  return -offset / 60
}

// Get timezone offset in hours for a given IANA timezone identifier at a specific time
export function getTimezoneOffsetForIANA(
  timezone: string,
  time: number,
): number {
  // Create a date object for the given UTC time
  const utcDate = new Date(time)

  // Format the same UTC time in the target timezone to get the local time representation
  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const tzParts = tzFormatter.formatToParts(utcDate)
  const parts = Object.fromEntries(
    tzParts.map(p => [p.type, parseInt(p.value || '0', 10)]),
  )

  // Create a date string in ISO format for the timezone time
  // We'll use this to create a date that represents the same moment in UTC
  const y = parts.year
  const m = String(parts.month).padStart(2, '0')
  const d = String(parts.day).padStart(2, '0')
  const H = String(parts.hour).padStart(2, '0')
  const M = String(parts.minute).padStart(2, '0')
  const S = String(parts.second).padStart(2, '0')
  const tzDateString = `${y}-${m}-${d}T${H}:${M}:${S}Z`

  // Parse this as UTC to get what UTC time would show the same numbers
  // The difference between the original UTC time and this tells us the offset
  const tzAsUtc = new Date(tzDateString).getTime()

  // The offset is: UTC-4 means we need to subtract 4 hours from UTC to get local time
  // offset = tzAsUtc - time (in hours)
  // This gives negative values for timezones behind UTC (like UTC-4 = -4)
  // and positive values for timezones ahead of UTC (like UTC+8 = +8)
  const offsetMs = tzAsUtc - time
  return offsetMs / HOUR
}

// Get current timezone offset (in hours) - supports both number and IANA timezone
function getCurrentTimezoneOffset(
  timezone: number | string,
  time: number,
): number {
  if (typeof timezone === 'string') {
    return getTimezoneOffsetForIANA(timezone, time)
  }
  return timezone
}

export class TimezoneDate implements Date {
  time: number
  timezone: number | string // in hour or IANA timezone identifier (e.g., "America/New_York")
  constructor(time: number = Date.now(), o?: { timezone?: number | string }) {
    this.time = time
    const t = o?.timezone
    this.timezone =
      t !== undefined
        ? t
        : fromDateTimezoneOffset(new Date().getTimezoneOffset())
  }

  toString(): string {
    return this.toDate().toString()
  }

  toLocaleString(): string
  toLocaleString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions,
  ): string
  toLocaleString(locales?: any, options?: any) {
    // If timezone is an IANA identifier and no timeZone option is provided, use it
    if (typeof this.timezone === 'string' && !options?.timeZone) {
      return this.toDate().toLocaleString(locales, {
        ...options,
        timeZone: this.timezone,
      })
    }
    return this.toTimezoneOffsetDate().toLocaleString(locales, options)
  }

  valueOf(): number {
    return this.time
  }

  [Symbol.toPrimitive](hint: 'default'): string
  [Symbol.toPrimitive](hint: 'string'): string
  [Symbol.toPrimitive](hint: 'number'): number
  [Symbol.toPrimitive](hint: string): string | number
  [Symbol.toPrimitive](hint: any) {
    return this.toDate()[Symbol.toPrimitive](hint) as any
  }

  // for formatting
  toTimezoneOffsetDate(): Date {
    let t = this.time
    const offset = getCurrentTimezoneOffset(this.timezone, this.time)
    t += offset * HOUR
    t += new Date().getTimezoneOffset() * MINUTE
    return new Date(t)
  }

  // convert to native Date object
  toDate(): Date {
    return new Date(this.time)
  }

  // the delta change on time value will be applied to this object
  // return the new time value
  tunnelTimezoneOffsetDate(f: (offsetDate: Date) => void): number {
    const offsetDate = this.toTimezoneOffsetDate()
    const oldTime = offsetDate.getTime()
    f(offsetDate)
    const newTime = offsetDate.getTime()
    const diff = newTime - oldTime
    this.time += diff
    return this.time
  }

  getDate(): number {
    return this.toTimezoneOffsetDate().getDate()
  }

  getDay(): number {
    return this.toTimezoneOffsetDate().getDay()
  }

  getFullYear(): number {
    return this.toTimezoneOffsetDate().getFullYear()
  }

  getHours(): number {
    return this.toTimezoneOffsetDate().getHours()
  }

  getMilliseconds(): number {
    return this.toTimezoneOffsetDate().getMilliseconds()
  }

  getMinutes(): number {
    return this.toTimezoneOffsetDate().getMinutes()
  }

  getMonth(): number {
    return this.toTimezoneOffsetDate().getMonth()
  }

  getSeconds(): number {
    return this.toTimezoneOffsetDate().getSeconds()
  }

  getTime(): number {
    return this.time
  }

  getTimezoneOffset(): number {
    const offset = getCurrentTimezoneOffset(this.timezone, this.time)
    return offset * -60
  }

  setTimezoneOffset(offset: number) {
    this.timezone = fromDateTimezoneOffset(offset)
  }

  getUTCDate(): number {
    return this.toDate().getUTCDate()
  }

  getUTCDay(): number {
    return this.toDate().getUTCDay()
  }

  getUTCFullYear(): number {
    return this.toDate().getUTCFullYear()
  }

  getUTCHours(): number {
    return this.toDate().getUTCHours()
  }

  getUTCMilliseconds(): number {
    return this.toDate().getUTCMilliseconds()
  }

  getUTCMinutes(): number {
    return this.toDate().getUTCMinutes()
  }

  getUTCMonth(): number {
    return this.toDate().getUTCMonth()
  }

  getUTCSeconds(): number {
    return this.toDate().getUTCSeconds()
  }

  setDate(date: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setDate(date))
  }

  setFullYear(year: number, month?: number, date?: number): number
  setFullYear(year: number, ...args: number[]): number {
    return this.tunnelTimezoneOffsetDate(d => d.setFullYear(year, ...args))
  }

  setHours(hours: number, min?: number, sec?: number, ms?: number): number
  setHours(hours: number, ...args: number[]): number {
    return this.tunnelTimezoneOffsetDate(d => d.setHours(hours, ...args))
  }

  setMilliseconds(ms: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setMilliseconds(ms))
  }

  setMinutes(min: number, sec?: number, ms?: number): number
  setMinutes(min: number, ...args: number[]): number {
    return this.tunnelTimezoneOffsetDate(d => d.setMinutes(min, ...args))
  }

  setMonth(month: number, date?: number): number
  setMonth(month: number, ...args: number[]): number {
    return this.tunnelTimezoneOffsetDate(d => d.setMonth(month, ...args))
  }

  setSeconds(sec: number, ms?: number): number
  setSeconds(sec: number, ...args: number[]): number {
    return this.tunnelTimezoneOffsetDate(d => d.setSeconds(sec, ...args))
  }

  setTime(time: number): number {
    return (this.time = time)
  }

  setUTCDate(date: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setUTCDate(date))
  }

  setUTCFullYear(year: number, month?: number, date?: number): number {
    return this.tunnelTimezoneOffsetDate(d =>
      d.setUTCFullYear(year, month, date),
    )
  }

  setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number {
    return this.tunnelTimezoneOffsetDate(d =>
      d.setUTCHours(hours, min, sec, ms),
    )
  }

  setUTCMilliseconds(ms: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setUTCMilliseconds(ms))
  }

  setUTCMinutes(min: number, sec?: number, ms?: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setUTCMinutes(min, sec, ms))
  }

  setUTCMonth(month: number, date?: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setUTCMonth(month, date))
  }

  setUTCSeconds(sec: number, ms?: number): number {
    return this.tunnelTimezoneOffsetDate(d => d.setUTCSeconds(sec, ms))
  }

  toDateString(): string {
    return this.toTimezoneOffsetDate().toDateString()
  }

  toISOString(): string {
    return this.toDate().toISOString()
  }

  toJSON(key?: any): string {
    return this.toDate().toJSON(key)
  }

  clone() {
    return new TimezoneDate(this.time, { timezone: this.timezone })
  }

  toLocaleDateString(): string
  toLocaleDateString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions,
  ): string
  toLocaleDateString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions,
  ): string {
    // If timezone is an IANA identifier and no timeZone option is provided, use it
    if (typeof this.timezone === 'string' && !options?.timeZone) {
      return this.toDate().toLocaleDateString(locales, {
        ...options,
        timeZone: this.timezone,
      })
    }
    return this.toTimezoneOffsetDate().toLocaleDateString(locales, options)
  }

  toLocaleTimeString(): string
  toLocaleTimeString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions,
  ): string
  toLocaleTimeString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions,
  ): string {
    // If timezone is an IANA identifier and no timeZone option is provided, use it
    if (typeof this.timezone === 'string' && !options?.timeZone) {
      return this.toDate().toLocaleTimeString(locales, {
        ...options,
        timeZone: this.timezone,
      })
    }
    return this.toTimezoneOffsetDate().toLocaleTimeString(locales, options)
  }

  toTimeString(): string {
    return this.toTimezoneOffsetDate().toTimeString()
  }

  toUTCString(): string {
    return this.toDate().toUTCString()
  }

  static fromTime(time: number): TimezoneDate {
    return new TimezoneDate(time)
  }

  static fromDate(date: Date): TimezoneDate {
    return new TimezoneDate(date.getTime(), {
      timezone: fromDateTimezoneOffset(date.getTimezoneOffset()),
    })
  }

  static from(time: number | Date): TimezoneDate {
    return typeof time === 'number' ? this.fromTime(time) : this.fromDate(time)
  }
}
