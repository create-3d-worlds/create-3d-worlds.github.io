import Model from './Model.js'
import {FBXLoader} from '../node_modules/three/examples/jsm/loaders/FBXLoader.js'

const fbxLoader = new FBXLoader()
const dir = '../assets/models/girl-fighter/'

export default class GirlFighter extends Model {
  constructor(callback, size) {
    super(callback, `${dir}girl-walk.fbx`, null, size, 'fbx')
  }

  loadFbxModel(callback, modelSrc, size) {
    fbxLoader.load(modelSrc, mesh => {
      callback(this.prepareMesh(mesh, size, Math.PI))
      const animations = mesh.animations.map(a => {
        if (a.name == 'mixamo.com') a.name = 'walk'
        if (a.name == 'Take 001') a.name = 'jump'
        return a
      })
      this.animations.push(...animations)
    })
    fbxLoader.load(`${dir}look-around.fbx`, ({animations}) => {
      this.animations.push({...animations[0], name: 'idle'})
    })
    fbxLoader.load(`${dir}run.fbx`, ({animations}) => {
      this.animations.push({...animations[0], name: 'run'})
    })
    fbxLoader.load(`${dir}gather-objects.fbx`, ({animations}) => {
      this.animations.push({...animations[0], name: 'squat'})
    })
    fbxLoader.load(`${dir}punch.fbx`, ({animations}) => {
      this.animations.push({...animations[0], name: 'attack'})
    })
    fbxLoader.load(`${dir}stumble-backwards.fbx`, ({animations}) => {
      this.animations.push({...animations[0], name: 'death'})
    })
  }
}