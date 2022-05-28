import { OrbitControls } from '/node_modules/three119/examples/jsm/controls/OrbitControls.js'

import renderer from './renderer.js'
import camera from './camera.js'

const controls = new OrbitControls(camera, renderer.domElement)

export default controls
