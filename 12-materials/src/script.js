import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AmbientLight, PointLight } from 'three'
import GUI from 'lil-gui';

/** GUI */
const gui = new GUI({
    name: 'Material',
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = false
/**
 * Objects
 */
const basicMaterial = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    side: THREE.DoubleSide,
})

const normalMaterial = new THREE.MeshNormalMaterial()

const meshMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    side: THREE.DoubleSide,
})

const depthMaterial = new THREE.MeshDepthMaterial()

const lambertMaterial = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
})

const phongMaterial = new THREE.MeshPhongMaterial({
    shininess: 100,
    specular: new THREE.Color(0x1188ff),
})

const meshToonMaterial = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture,
})

const meshStandardMaterial = new THREE.MeshStandardMaterial({
    // metalness: 0.152,
    // roughness: 0.545,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    aoMapIntensity: 0.5,
    normalMap: doorNormalTexture,
    normalScale: new THREE.Vector2(1, 1),
    displacementMap: doorHeightTexture,
    displacementScale: 0.05,
    side: THREE.DoubleSide,
    alphaMap: doorAlphaTexture,
    transparent: true,
})

// gui.add(meshStandardMaterial, 'aoMapIntensity').min(0).max(1).step(0.001)
// gui.add(meshStandardMaterial, 'displacementScale').min(0).max(0.2).step(0.001)

const cubeLoader = new THREE.CubeTextureLoader()
const enviromentMapTexture = cubeLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])
// https://hdri-haven.com/
// https://matheowis.github.io/HDRI-to-CubeMap/
const generatedEnviromentMapTexture = cubeLoader.load([
    '/textures/environmentMaps/generated/px.png',
    '/textures/environmentMaps/generated/nx.png',
    '/textures/environmentMaps/generated/py.png',
    '/textures/environmentMaps/generated/ny.png',
    '/textures/environmentMaps/generated/pz.png',
    '/textures/environmentMaps/generated/nz.png',
])
const anotherStandardMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    envMap: generatedEnviromentMapTexture,
})
gui.add(anotherStandardMaterial, 'metalness').min(0).max(1).step(0.001)
gui.add(anotherStandardMaterial, 'roughness').min(0).max(1).step(0.001)

const material = anotherStandardMaterial

/** Objects */

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
sphere.position.x = -1.5
scene.add(sphere)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
scene.add(plane)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
torus.position.x = 1.5
scene.add(torus)

/** Lights */
const ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = 0.1 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime

    // sphere.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()