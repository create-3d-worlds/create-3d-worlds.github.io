import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { createFullScene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import Avion from './Avion.js'

/**
 * TODO:
 * dodati sunce
 * dodati drveće
 * srediti kontrole: skretanje, spuštanje, dizanje, brzinu
 * BUG:
 * senka ubrzo nestaje
 */

let avion
let mouseDown = false

const scene = createFullScene({ color:0xFFC880 })
const controls = createOrbitControls()

/* UPDATE */

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  avion.normalizePlane()
  avion.position.z += .5
  if (!mouseDown)
    camera.position.lerp({ ...avion.position, z: avion.position.z - 100 }, 0.05)
  // camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* LOAD */

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  avion = new Avion(collada.scene)
  avion.rotateZ(Math.PI)
  avion.position.y = 50
  controls.target = avion.position
  camera.position.set(-68, 100, -90)
  scene.add(avion)
  animate()
})

/* EVENTS */

document.body.onmousedown = () => {
  mouseDown = true
}
document.body.onmouseup = () => {
  mouseDown = false
}

