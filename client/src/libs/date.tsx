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

// Time to Deadline
export const dateToDeadline = (date: Date): string => {
  const now = new Date()
  const deadline = new Date(date)
  const diff = deadline.getTime() - now.getTime()

  return (
    'あと' +
    Math.floor(diff / (1000 * 60 * 60 * 24)) +
    '日' +
    Math.floor((diff / (1000 * 60 * 60)) % 24) +
    '時間' +
    Math.floor((diff / (1000 * 60)) % 60) +
    '分'
  )
}
