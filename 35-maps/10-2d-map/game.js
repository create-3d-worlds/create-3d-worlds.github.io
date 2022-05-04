import Map2DRenderer from '/classes/2d/Map2DRenderer.js'
import matrix from '/data/small-map.js'

const mapRenderer = new Map2DRenderer({ matrix, cellSize: 30 })
mapRenderer.drawMap()
