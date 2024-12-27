import * as THREE from 'three'
import { camera, scene, renderer, setBackground } from '/core/scene.js'
import { material } from '/core/shaders/gradient.js'

setBackground(0x00000)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
scene.add(plane)

renderer.render(scene, camera)