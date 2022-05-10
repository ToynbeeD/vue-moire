export default function getTitle (n) {
  return `товар${(n % 100 < 11 || n % 100 > 19) ? ((n % 10 !== 1) ? ((n % 10 > 1 && n % 10 < 5) ? 'а' : 'ов') : '') : 'ов'}`
}
