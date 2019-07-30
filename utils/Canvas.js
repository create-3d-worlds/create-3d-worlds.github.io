let instance = null

// Singleton
export default class Canvas extends HTMLCanvasElement {
  constructor() {
    super()
    if (!instance) instance = this
    document.body.style.margin = 0
    document.body.style.padding = 0
    document.body.appendChild(instance)
    return instance
  }

  connectedCallback() {
    this.height = window.innerHeight || 600 // height must first
    this.width = document.body.clientWidth || 800
    this.style.backgroundColor = 'lightgray'
    this.focus()
  }

  hide() {
    this.style.display = 'none'
  }

  show() {
    this.style.display = 'block'
  }

  get ctx() {
    return this.getContext('2d')
  }

  get diagonal() {
    return Math.sqrt(this.height * this.height + this.width * this.width)
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
