const style = `
  position: absolute;
  color: yellow;
  top: 20px;
  left: 20px;
`

export default class Score {
  constructor({ points = 0, title = 'Score', subtitle, subValue } = {}) {
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
    this.div.innerHTML = `${this.title}: ${this.points}`
    if (this.subValue) this.div.innerHTML += `<br>${this.subtitle}: ${subValue}`
  }
}