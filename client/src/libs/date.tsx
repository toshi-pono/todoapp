export const toFormDate = (date: Date): string => {
  const d = new Date(date)
  return d.toISOString().split(':')[0] + ':' + d.toISOString().split(':')[1]
}
