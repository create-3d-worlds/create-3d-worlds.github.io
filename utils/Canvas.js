let instance = null

// Singleton
export default class Canvas extends HTMLCanvasElement {
  constructor() {
    super()
    if (!instance) instance = this
    instance.ctx = instance.getContext('2d')
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

  get diagonal() {
    return Math.sqrt(this.height * this.height + this.width * this.width)
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
