export function assert(o: { expect: any; actual: any; name: string }) {
  if (o.expect !== o.actual) {
    console.error('Fail:', o)
    process.exit(1)
  } else {
    console.log('Pass:', o.name)
  }
}
