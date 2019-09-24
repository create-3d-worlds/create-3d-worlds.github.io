import Canvas from './Canvas.js'

export default class SmallMapRenderer extends Canvas {
  // constructor(color = 'transparent') {
  //   super(color)
  // }
}

customElements.define('small-map', SmallMapRenderer, { extends: 'canvas' })
