import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapMaterial = textureLoader.load("/textures/matcaps/8.png");
matcapMaterial.colorSpace = THREE.SRGBColorSpace;
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapMaterial;

//  font
const fontLoader = new FontLoader();
const tab = []

fontLoader.load("/fonts/helvetiker_bold.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Daniel 3kd", {
    font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();
  textGeometry.computeBoundingBox()
  console.log(textGeometry.boundingBox)

  const text = new THREE.Mesh(textGeometry, material);

  scene.add(text);
  const textBoundingBox = textGeometry.boundingBox;
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 40);

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);

    let positionIsValid = false;

    while (!positionIsValid) {
      // Generate random position
      donut.position.x = (Math.random() - 0.5) * 10;
      donut.position.y = (Math.random() - 0.5) * 10;
      donut.position.z = (Math.random() - 0.5) * 10;

      // Check if the position is outside the bounding box of the text
      if (
        !(
          donut.position.x > textBoundingBox.min.x - 1 &&
          donut.position.x < textBoundingBox.max.x + 1 &&
          donut.position.y > textBoundingBox.min.y - 1 &&
          donut.position.y < textBoundingBox.max.y + 1 &&
          donut.position.z > textBoundingBox.min.z - 1 &&
          donut.position.z < textBoundingBox.max.z + 1
        )
      ) {
        positionIsValid = true;
      }
    }

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    tab[i] = donut;
    scene.add(donut);
}


  
});




// console.log(textGeometry)
// create object randomly

// const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 40);

// const tab = [];

// for (let i = 0; i < 100; i++) {
//   const donut = new THREE.Mesh(donutGeometry, material);
  

//   donut.position.x = (Math.random() - 0.5) * 10;
//   donut.position.y = (Math.random() - 0.5) * 10;
//   donut.position.z = (Math.random() - 0.5) * 10;
//   console.log(donut.position)

//   donut.rotation.x = Math.random() * Math.PI;
//   donut.rotation.y = Math.random() * Math.PI;

//   const scale = Math.random();
//   donut.scale.set(scale, scale, scale);
//   tab[i] = donut;
//   scene.add(donut);
// }





/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  for(let i =0; i< tab.length; i++){
    // console.log(tab[i])

    tab[i].rotation.x = elapsedTime * Math.PI * 0.25
    tab[i].rotation.y = elapsedTime * Math.PI * 0.25
    // tab[i].rotation.z
  }
  

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
