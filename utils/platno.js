const platno = document.getElementById('platno') || document.createElement('canvas')
const podloga = platno.getContext('2d')

if (!document.getElementById('platno')) {
  document.body.appendChild(platno)
  platno.id = 'platno'
}

platno.height = window.innerHeight || 600 // mora prvo visina
platno.width = document.body.clientWidth || 800
platno.style.backgroundColor = 'lightgray'
platno.focus()

const sakrijPlatno = () => {
  platno.style.display = 'none'
}

const pokaziPlatno = () => {
  platno.style.display = 'block'
}

const dijagonalaPlatna = Math.sqrt(platno.height * platno.height + platno.width * platno.width)

export {platno, podloga, sakrijPlatno, pokaziPlatno, dijagonalaPlatna}
export default platno
