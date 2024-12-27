import GameObject from '/core/objects/GameObject.js'
import { loadModel } from '/core/loaders.js'

const mesh = await loadModel({ file: 'building/monument/knight/knight.fbx', size: 15, shouldAdjustHeight: true, shouldCenter: true })

export default class Monument extends GameObject {
  constructor(params = {}) {
    super({ mesh, ...params })
  }
}