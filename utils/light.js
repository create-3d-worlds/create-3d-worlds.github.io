import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene as defaultScene } from '/utils/scene.js'

export function dirLight({ scene = defaultScene, position = [20, 20, 20], color = 0xffffff, intensity = 1  } = {}) {
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(...position)
  light.castShadow = true
  scene.add(light)
}
