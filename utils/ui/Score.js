const webFonts = ['Arial', 'Verdana', 'Trebuchet MS', 'Brush Script MT', 'Brush Script MT']

const getStyle = (color, stroke) => /* css */`
  .score {
    color: ${color};
    left: 20px;
    position: absolute;
    top: 20px;
    user-select: none;
    text-shadow: -1px -1px 0 ${stroke}, 1px -1px 0 ${stroke}, -1px  1px 0 ${stroke}, 1px  1px 0 ${stroke};
    font-family: Verdana;
  }

  .score h3 {
    margin: 0 0 8px;
  }

  .blink {
    animation: blinker 1s step-start infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`

export default class Score {
  constructor({ title = 'Score', points = 0, subtitle, subvalue, color = 'yellow', stroke = '#000' } = {}) {
    this.points = points
    this.title = title
    this.subtitle = subtitle
    this.subvalue = subvalue

    this.div = document.createElement('div')
    this.div.className = 'score'
    document.body.appendChild(this.div)

    const style = document.createElement('style')
    style.textContent = getStyle(color, stroke)
    document.head.appendChild(style)

    const saved = localStorage.getItem(location.pathname)
    console.log('hi score: ', JSON.parse(saved))

    this.render(points, subvalue)
  }

  render(point = 1, subvalue) {
    this.points += point

    this.div.innerHTML = `<h3>${this.title}: ${this.points}</h3>`
    if (this.subvalue) this.div.innerHTML += `<div class="blink">${this.subtitle}: ${subvalue}</div>`

    // da čuva samo ako je oboren prethodni skor
    localStorage.setItem(location.pathname, this.points)
  }
}