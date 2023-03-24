/* GUI */

export function victory() {
  document.getElementById('msg').innerHTML = '<h1>Victory</h1>'
  document.getElementById('msg').style.color = '#0AB408'
}

export function gameOver() {
  document.getElementById('msg').innerHTML = '<h1>Game over</h1>'
  document.getElementById('msg').style.color = 'red'
}
