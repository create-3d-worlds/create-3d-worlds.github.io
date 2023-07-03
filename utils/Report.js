function createHtml(container) {
  const div = document.createElement('div')
  div.className = 'report'
  container.prepend(div)

  const p = document.createElement('p')
  div.appendChild(p)
  return p
}

export default class Report {
  constructor({ text = 'Destroy all enemy aircraft.', container = document.body } = {}) {
    this.i = 0
    this.intervalId
    this.text = text
    this.container = container
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
    if (this.container.style.display == 'none') this.audio.volume = 0
    this.i++
  }

  init() {
    if (this.intervalId) return
    this.intervalId = window.setInterval(this.kucaj, 80)
    this.audio.play()
  }
}
