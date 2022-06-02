import * as THREE from '/node_modules/three125/build/three.module.js'
import { scene as defaultScene } from '/utils/scene.js'

export function dirLight({ scene = defaultScene, position = [20, 50, 20], color = 0xffffff, intensity = 1 } = {}) {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(...position)
  light.castShadow = true
  light.shadow.camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.5, position[1] * 3)
  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(helper)
  scene.add(light)
}

export function hemLight({ scene = defaultScene, skyColor = 0xfffff0, groundColor = 0x101020, intensity = 1 } = {}) {
  const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, intensity)
  hemisphereLight.name = 'hemisphereLight' // needed for some cases
  scene.add(hemisphereLight)
}

export function spotLight({ scene = defaultScene, position = [75, 75, 75], color = 0xffffff, intensity = 1 } = {}) {
  const spotLight = new THREE.SpotLight(color, intensity)
  spotLight.position.set(...position)
  spotLight.castShadow = true
  scene.add(spotLight)
}

export function ambLight({ scene = defaultScene, color = 0xffffff, intensity = 1 } = {}) { // 0x343434
  const ambient = new THREE.AmbientLight(color, intensity)
  scene.add(ambient)
}

export function initLights({ scene = defaultScene, position = [-10, 30, 40] } = {}) {
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(...position)
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.camera.fov = 15
  spotLight.castShadow = true
  spotLight.decay = 2
  spotLight.penumbra = 0.05
  spotLight.name = 'spotLight'
  scene.add(spotLight)

  const ambientLight = new THREE.AmbientLight(0x343434)
  ambientLight.name = 'ambientLight'
  scene.add(ambientLight)
}

export function createSunLight({ x = 150, y = 350, z = 350, d = 400, far = 3500, target } = {}) {
  const light = new THREE.DirectionalLight(0xffffff, 1)
  // light.intensity = 0.4
  light.position.set(x, y, z)
  light.castShadow = true
  // area of the shadow https://threejs.org/docs/#api/en/lights/shadows/DirectionalLightShadow
  light.shadow.camera.left = -d
  light.shadow.camera.right = d
  light.shadow.camera.top = d
  light.shadow.camera.bottom = -d
  light.shadow.camera.far = far
  // svetlo prati objekat
  if (target) light.target = target
  light.name = 'sunLight'
  return light
}
