import SmallMapRenderer from '/classes/2d/SmallMapRenderer.js'
import matrix from '/data/small-map.js'

const canvas = new SmallMapRenderer({matrix, cellSize: 30})
canvas.drawMap()
