export const toFormDate = (date: Date): string => {
  const d = new Date(date)
  return d.toISOString().split(':')[0] + ':' + d.toISOString().split(':')[1]
}

// yyyy/mm/dd hh:mm filled with 0
export const dateToView = (date: Date): string => {
  const d = new Date(date)
  return (
    d.getFullYear() +
    '/' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + d.getDate()).slice(-2) +
    ' ' +
    ('0' + d.getHours()).slice(-2) +
    ':' +
    ('0' + d.getMinutes()).slice(-2)
  )
}
