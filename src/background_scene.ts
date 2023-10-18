import * as three from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const scene = new three.Scene()

const camera = new three.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 8

const renderer = new three.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("background").appendChild(renderer.domElement)

const loader = new GLTFLoader();

// let fish: three.Group | null = null
// loader.load("public/bluefin_tuna.glb", (gltf) => {
//   bluefinTuna.model = gltf.scene
// });
// loader.load("public/yellow_fish.glb", (gltf) => {
//   yellowFish.model = gltf.scene
// });

const fish = (await loader.loadAsync("/bluefin_tuna.glb")).scene;

const directionalLight = new three.DirectionalLight(0xa0b0c0, 3)
directionalLight.translateOnAxis(new three.Vector3(.2, .5, 1), 1)
const keyLight = new three.DirectionalLight(0x5080f0, 4)
keyLight.translateOnAxis(new three.Vector3(-.1, .1, -1), 1)
const ambientLight = new three.AmbientLight(0x394959)

const loader2 = new three.TextureLoader()
let water_caustics: Map<number, three.Texture> = new Map()
for (let i = 1; i <= 36; i++) {
  loader2.load(`/water_caustics/water_caustic_${i}.png`, (texture) => water_caustics.set(i - 1, texture))
}

const spotLight = new three.SpotLight(0xafbfff, 5);
spotLight.position.set(2, 5, 2);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 1;
spotLight.decay = 2;
spotLight.distance = 0;

scene.add(directionalLight, ambientLight, keyLight, spotLight, fish)

window.addEventListener('resize', onWindowResize, false) // why false?
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

const clock = new three.Clock();

function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta();

  if (fish) {
    fish.rotation.y += delta
  }

  spotLight.map = water_caustics.get(Math.floor(clock.elapsedTime * 60) % 36) ?? null

  render()
}

function render() {
  renderer.render(scene, camera)
}

animate()


