# create-rpg-game

Create a role-playing game!

Repo: https://github.com/mudroljub/create-rpg-game

## Plan

### Mapa (*tilemaps*)

- [x] napraviti nekoliko *tilemap*-a
  - [x] implementirati algoritam za pravljenje lavirinta
- [x] renderovati mapu u 2d
- [x] renderovati mapu u 3d
  - [x] renderovati mapu sa teksturama

### Igrac

- [x] dodati igraca
- [x] prikazati polozaj igraca na mapi
- [x] omogućiti 2d kretanje kroz mapu
- [x] omogućiti 3d kretanje kroz mapu
- [x] dodati skakanje

### Kamere

- [x] dodati kameru iz prvog lica (fps)
- [x] dodati kameru odozgo (orbit)
- [x] menjati kamere na taster

### Kolizija

- [x] dodati koliziju kako se ne bi prolazilo kroz predmete
  - [x] probati koliziju bacanjem zraka
  - [x] probati koliziju geometrijom
- [x] postaviti lavirint sa kolizijom

### Prodecuralna geometrija

- [x] napraviti tlo
- [x] dodati koliziju na tlo
- [x] dodati osnovnu geometriju
  - [ ] dodati okruzenje (drveće, nebo, zgrade)
  - [ ] dodati neke stvari (sanduke i slicno)
- [ ] proceduralno kreirati okruženje
  - https://subscription.packtpub.com/book/web_development/9781783980864/5/ch05lvl1sec34/creating-a-3d-terrain-from-scratch
  - https://github.com/mudroljub/mini-rpg
- [ ] kreirati stepenice u krug od kocki
- [ ] prebaciti da tlo bude okruglo
- [ ] heightmap:
    - https://github.com/josdirksen/threejs-cookbook/blob/master/02-geometries-meshes/02.06-create-terrain-from-heightmap.html
    - https://stemkoski.github.io/Three.js/Shader-Heightmap-Textures.html
    - https://stackoverflow.com/questions/7638008/webgl-textured-terrain-with-heightmap
    - https://github.com/mrdoob/three.js/issues/1003
    - http://oos.moxiecode.com/js_webgl/terrain/index.html

### Modeli

- [ ] ucitati 3d model igraca
  - [ ] animirati model (kretanje, trčanje, skok...)
  - [ ] da se vide ruke iz prvog lica
- [ ] dodati NPC karaktere
- [ ] ucitati raspolozive modele vozila i kuca
  - [ ] dodati avion kako nadlece
  - [ ] dodati tenk kako se krece
- [ ] reagovati na koliziju

### Fizika

- [ ] dodati fiziku https://github.com/chandlerprall/Physijs

### Mehanika igre

- [ ] napraviti inventar
- [ ] postaviti objekte za sakupljanje i okidace za njih
  - https://www.the-art-of-web.com/javascript/maze-game/#box1 (2D)
  - https://threejs.org/examples/?q=cube#webgl_interactive_cubes
  - https://threejsfundamentals.org/threejs/lessons/threejs-picking.html
  - https://codepen.io/kintel/pen/ZboOxw

### Nivoi

- [ ] napraviti igrive nivoe
  - [ ] bežanje od štuke koja bombarduje
  - [ ] skrivanje od reflektora logora

### VR

- [ ] probati VR
  - https://threejs.org/docs/#manual/en/introduction/How-to-create-VR-content

## Documentation

Prikazuje pomocnu strelicu za raycaster:

```
scene.add(new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300))
```

## Resursi

- [Build a basic combat game with three.js](http://www.creativebloq.com/web-design/build-basic-combat-game-threejs-101517540)
- https://github.com/mudroljub/3D-RPG-Game-With-THREE.js
- https://github.com/mudroljub/threejs-monster
- https://github.com/mudroljub/rpg-threejs (school project)

- https://github.com/skolakoda/ucimo-threejs
- https://github.com/skolakoda/teorija-razvoja-igara
- https://github.com/skolakoda/ucimo-razvoj-igara

- https://github.com/mudroljub/savo-mitraljezac
- https://github.com/mudroljub/igrica-partizani
- https://github.com/mudroljub/avantura-1941
