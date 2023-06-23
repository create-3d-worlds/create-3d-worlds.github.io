import * as THREE from 'three'
import config from '/config.js'
import input from '/utils/io/Input.js'
import { scene as defaultScene } from '/utils/scene.js'
import { mapRange } from './helpers.js'

const { randInt } = THREE.MathUtils

let oldIntensity, oldBackground

/* LIGHTS */

export function dirLight({
  scene = defaultScene,
  pos = [20, 50, 20],
  color = 0xffffff,
  intensity = 1,
  target,
  mapSize = 512,
  area = 5,
} = {}) {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(...pos)
  light.castShadow = true
  light.shadow.mapSize.width = light.shadow.mapSize.height = mapSize
  if (target) light.target = target
  if (scene) scene.add(light)
  light.shadow.camera.left = light.shadow.camera.bottom = -area
  light.shadow.camera.right = light.shadow.camera.top = area
  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(helper)
  return light
}

export function pointLight({ scene = defaultScene, color = 0xffffff, intensity = 1, mapSize = 512, pos = [0, 30, 30] } = {}) {
  const light = new THREE.PointLight(color, intensity)
  light.position.set(...pos)
  light.castShadow = true
  light.shadow.mapSize.width = light.shadow.mapSize.height = mapSize
  if (scene) scene.add(light)
  return light
}

export function spotLight({ scene = defaultScene, color = 0xffffff, intensity = 1, mapSize = 512 } = {}) {
  const light = new THREE.SpotLight(color, intensity)
  light.castShadow = true
  light.shadow.mapSize.width = light.shadow.mapSize.height = mapSize
  if (scene) scene.add(light)
  return light
}

export function hemLight({ scene = defaultScene, skyColor = 0xfffff0, groundColor = 0x101020, intensity = 1 } = {}) {
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
  if (scene) scene.add(light)
  return light
}

export function ambLight({ scene = defaultScene, color = 0xffffff, intensity = 1 } = {}) { // 0x343434
  const light = new THREE.AmbientLight(color, intensity)
  if (scene) scene.add(light)
  return light
}

/* SUN */

export function createSun({ color = 0xffffff, intensity = 1, target, pos = [15, 50, 50], mapSize = 1024, r = 1, transparent = false, planetColor = 0xFCE570, addLight = true, file } = {}) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(r),
    new THREE.MeshToonMaterial({
      color: planetColor,
      transparent,
      opacity: transparent ? 0 : 1,
      map: file ? new THREE.TextureLoader().load(`/assets/textures/${file}`) : null
    })
  )
  if (addLight) {
    const light = pointLight({ color, intensity, target, mapSize })
    const ambientLight = new THREE.AmbientLight(0xfffee1, intensity * .5)
    mesh.add(light, ambientLight)
  }
  mesh.position.set(...pos)
  return mesh
}

export const createMoon = ({
  pos = [50, 100, 50], color = 0xFFF8DE, planetColor = 0xF6F1D5, r = 4, ...rest
} = {}) => createSun({ pos, color, planetColor, r, ...rest })

/* EFFECTS */

export function lightningStrike(light, scene = defaultScene) {
  if (!oldIntensity) oldIntensity = light.intensity
  if (!oldBackground) oldBackground = new THREE.Color(scene.background)

  const audio = new Audio('/assets/sounds/thunder.mp3')

  const distance = randInt(100, 3000)
  audio.volume = mapRange(distance, 3000, 100, config.volume / 4, config.volume)
  light.intensity = mapRange(distance, 3000, 100, 1.2, 2)

  const newColor = new THREE.Color().lerpColors(
    oldBackground, new THREE.Color(0xFFFFFF), light.intensity - 1
  )

  scene.background = newColor

  setTimeout(() => {
    light.intensity = oldIntensity
    scene.background = oldBackground
  }, 500)

  setTimeout(() => {
    audio.currentTime = 0
    if (input.touched) audio.play()
  }, distance * 3)
}

/* UPDATES */

export function sunFollow(sun, pos) {
  sun.position.copy(pos)
  sun.position.add(new THREE.Vector3(-10, 500, -10))
  sun.target.position.copy(pos)
  sun.updateMatrixWorld()
  sun.target.updateMatrixWorld()
}

export function lightFollow(light, target, distance = [12, 8, 1]) {
  const newPos = new THREE.Vector3(...distance).add(target.position)
  light.position.copy(newPos)
}

/* ORBIT */

export function orbiting(planet, time, radiusX = 8, axis = 0, radiusZ = radiusX) {
  const x = Math.cos(time) * radiusX
  const z = Math.sin(time) * radiusZ

  switch (axis) {
    case 1:
      planet.position.x = x
      planet.position.y = z
      break
    case 2:
      planet.position.set(x, z, z)
      break
    case 3:
      planet.position.set(x, x, z)
      break
    default:
      planet.position.x = x
      planet.position.z = z
      break
  }
}

export function orbitAround({ moon, planet, time, radiusX = 8, axis = 0, radiusZ = radiusX }) {
  orbiting(moon, time, radiusX, axis, radiusZ)
  moon.position.x += planet.position.x
  moon.position.y = planet.position.y
  moon.position.z += planet.position.z
}