const style = `
  color: yellow;
  left: 20px;
  position: absolute;
  top: 20px;
  user-select: none;
`

export default class Score {
  constructor({ title = 'Score', points = 0, subtitle, subValue } = {}) {
    this.points = points
    this.title = title
    this.subtitle = subtitle
    this.subValue = subValue
    this.div = document.createElement('div')
    this.div.style.cssText = style
    document.body.appendChild(this.div)

    this.render(points, subValue)
  }

  render(point = 1, subValue) {
    this.points += point
    this.div.innerHTML = `<h3 style="margin:4px 0">${this.title}: ${this.points}</h3>`
    if (this.subValue) this.div.innerHTML += `<div>${this.subtitle}: ${subValue}</div>`
  }
}