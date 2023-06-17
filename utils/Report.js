function createHtml(container) {
  const divStyle = `
  background-color: #cccccc;
  background-image: url(/assets/images/document.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  height: 24.3em;
  margin: 0 auto;
  width: 39.6em;
`

  const pStyle = `
  font-family: Courier;
  font-size: 110%;
  font-weight: bold;
  letter-spacing: 0.04em;
  line-height: 1.2;
  padding-left: 15%;
  padding-right: 15%;
  padding-top: 12em;
  margin: 0;
`

  const div = document.createElement('div')
  div.setAttribute('style', divStyle)
  container.prepend(div)

  const p = document.createElement('p')
  p.setAttribute('style', pStyle)
  div.appendChild(p)
  return p
}

export default class Report {
  constructor({ text = 'Destroy all enemy aircraft.', container = document.body } = {}) {
    this.i = 0
    this.intervalId
    this.text = text
    this.p = createHtml(container)
    this.audio = new Audio('/assets/sounds/typing.mp3')
    this.kucaj = this.kucaj.bind(this)

    this.init()
  }

  kucaj() {
    this.p.innerHTML += this.text.charAt(this.i)
    this.p.innerHTML = this.p.innerHTML.replace(/\n/g, '<br>')
    if (this.i >= this.text.length) {
      this.audio.pause()
      clearInterval(this.intervalId)
    }
    this.i++
  }

  init() {
    if (this.intervalId) return
    this.intervalId = window.setInterval(this.kucaj, 80)
    this.audio.play()
  }
}
