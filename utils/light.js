import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene } from '/utils/scene.js'

export function dirLight(theScene = scene, position = [20, 20, 20]) {
  const light = new THREE.DirectionalLight(0xffffff, 1.75)
  light.position.set(...position)
  light.castShadow = true
  theScene.add(light)
}