const style = `
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
`

const bodyStyle = `
  margin: 0;
  padding: 0;
  overflow: hidden;
`

export default class Canvas extends HTMLCanvasElement {
  constructor() {
    super()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.style = style
    document.body.style = bodyStyle
    document.body.appendChild(this)
  }

  get ctx() {
    return this.getContext('2d')
  }

  hide() {
    this.style.display = 'none'
  }

  show() {
    this.style.display = 'block'
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
}

customElements.define('my-canvas', Canvas, { extends: 'canvas' })
