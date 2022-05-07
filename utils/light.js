import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene as defaultScene } from '/utils/scene.js'

export function dirLight({ scene = defaultScene, position = [20, 20, 20], color = 0xffffff, intensity = 1  } = {}) {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(...position)
  light.castShadow = true
  scene.add(light)
}

export function hemLight({ scene = defaultScene, intensity = 1 } = {}) {
  const hemisphereLight = new THREE.HemisphereLight(0xfffff0, 0x101020, intensity)
  hemisphereLight.name = 'hemisphereLight'
  scene.add(hemisphereLight)
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
