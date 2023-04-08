const getStyle = (color, stroke) => /* css */`
  body {
    color: ${color};
    font-family: Verdana;
    text-shadow: -1px -1px 0 ${stroke}, 1px -1px 0 ${stroke}, -1px  1px 0 ${stroke}, 1px  1px 0 ${stroke};
    user-select: none;
  }

  .score {
    left: 20px;
    position: absolute;
    top: 20px;
  }

  .score h3 {
    margin: 0 0 8px;
  }

  .central {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 40px 40px 40px;
    text-align: center;
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

    this.scoreDiv = document.createElement('div')
    this.scoreDiv.className = 'score'
    document.body.appendChild(this.scoreDiv)

    this.centralDiv = document.createElement('div')
    this.centralDiv.className = 'central'
    document.body.appendChild(this.centralDiv)

    const style = document.createElement('style')
    style.textContent = getStyle(color, stroke)
    document.head.appendChild(style)

    this.highScore = Number(localStorage.getItem(location.pathname))
    console.log('High score: ', this.highScore)

    this.render(points, subvalue)
  }

  /* call render only when score changes, because of optimisation  */
  render(point = 1, subvalue) {
    this.points += point

    this.scoreDiv.innerHTML = `<h3>${this.title}: ${this.points}</h3>`
    if (this.subvalue) this.scoreDiv.innerHTML += `<div class="blink">${this.subtitle}: ${subvalue}</div>`

    if (this.points > this.highScore)
      localStorage.setItem(location.pathname, this.points)
  }

  renderVictory() {
    this.centralDiv.innerHTML = `<h1>BRAVO!</h1>
    <h3>You have collected all coins</h3>
    `
  }
}