// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();



// import getStarfield from "./getStarfield.js";
// import { getFresnelMat } from "./getFresnelMat.js";
// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { GUI } from 'dat.gui';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const EarthVisualization = () => {
//   const mountRef = useRef(null);
//   let scene, camera, renderer, earthGroup, dayNight, cloudsMesh, fresnelMesh;
//   const dayMapJPG = './textures/00_earthmap1k.jpg';
//   const nightMapJPG = './textures/earth_lights_lrg.jpg';
//   const cloudMapJPG = './textures/05_earthcloudmaptrans.jpg';
//   let sunLight = new THREE.Vector3(20, 20, 20);
//   let rimHex = 0x4bc5c4;
//   const facingHex = 0x000000;
//   let starGroup = new THREE.Group();
//   let numOfStars = 1000;
//   const gui = new GUI();

//   useEffect(() => {
//     const w = window.innerWidth;
//     const h = window.innerHeight;

//     // Initialize renderer
//     renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(w, h);
//     mountRef.current.appendChild(renderer.domElement);

//     // Scene and camera setup
//     scene = new THREE.Scene();
//     camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
//     camera.position.z = 3;

//     // Initialize the Earth and glow
//     createEarth(dayMapJPG, nightMapJPG);
//     createGlow(rimHex, facingHex);
//     createClouds(cloudMapJPG);
//     createStars(numOfStars);

//     // Initialize controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.03;

//     // Start the animation
//     animate();

//     // Handle window resize
//     window.addEventListener('resize', onWindowResize);

//     // Initialize GUI controls
//     renderControls();

//     return () => {
//       mountRef.current.removeChild(renderer.domElement);
//       gui.destroy();
//     };
//   }, []);

//   const createEarth = (dayMapJPG, nightMapJPG) => {
//     const textureLoader = new THREE.TextureLoader();
//     const dayMap = textureLoader.load(dayMapJPG);
//     const nightMap = textureLoader.load(nightMapJPG);

//     const geometry = new THREE.SphereGeometry(1, 64, 64);

//     const material = new THREE.ShaderMaterial({
//       uniforms: {
//         dayTexture: { value: dayMap },
//         nightTexture: { value: nightMap },
//         lightDirection: { value: sunLight },
//       },
//       vertexShader: `...`,  // Include your vertex shader code here
//       fragmentShader: `...`,  // Include your fragment shader code here
//       side: THREE.DoubleSide,
//     });

//     earthGroup = new THREE.Group();
//     earthGroup.rotation.z = -23.4 * Math.PI / 180;

//     dayNight = new THREE.Mesh(geometry, material);
//     earthGroup.add(dayNight);
//     scene.add(earthGroup);
//   };

//   const createGlow = (rimHex, facingHex) => {
//     const fresnelMat = getFresnelMat({ rimHex, facingHex });
//     const geometry = new THREE.SphereGeometry(1, 64, 64);
//     fresnelMesh = new THREE.Mesh(geometry, fresnelMat);
//     fresnelMesh.scale.set(1.001, 1.001, 1.001);
//     earthGroup.add(fresnelMesh);
//   };

//   const createClouds = (cloudMapJPG) => {
//     const textureLoader = new THREE.TextureLoader();
//     const cloudMap = textureLoader.load(cloudMapJPG);

//     const geometry = new THREE.SphereGeometry(1, 64, 64);
//     const cloudsMat = new THREE.MeshStandardMaterial({
//       map: cloudMap,
//       transparent: true,
//       opacity: 0.5,
//       blending: THREE.AdditiveBlending,
//     });

//     cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
//     cloudsMesh.scale.set(1.02, 1.02, 1.02);
//     earthGroup.add(cloudsMesh);
//   };

//   const createStars = (numOfStars) => {
//     if (starGroup) {
//       scene.remove(starGroup);
//       starGroup.children.forEach(star => star.geometry.dispose());
//     }
//     starGroup = new THREE.Group();
//     let stars = getStarfield({ numStars: numOfStars });
//     starGroup.add(stars);
//     scene.add(starGroup);
//   };

//   const animate = () => {
//     requestAnimationFrame(animate);
//     dayNight.rotation.y += 0.0005;
//     cloudsMesh.rotation.y -= 0.0003;
//     renderer.render(scene, camera);
//   };

//   const onWindowResize = () => {
//     const w = window.innerWidth;
//     const h = window.innerHeight;
//     camera.aspect = w / h;
//     camera.updateProjectionMatrix();
//     renderer.setSize(w, h);
//   };

//   const renderControls = () => {
//     controlCloudRotation();
//     controlSun();
//     controlNumOfStars();
//     controlGlowColor();
//   };

//   const controlCloudRotation = () => {
//     const cloudsFolder = gui.addFolder("Clouds");
//     cloudsFolder.add(cloudsMesh.rotation, 'x', -0.5, Math.PI * 2).name('Rotate X Axis');
//     cloudsFolder.add(cloudsMesh.rotation, 'y', -0.5, Math.PI * 2).name('Rotate Y Axis');
//     cloudsFolder.add(cloudsMesh.rotation, 'z', -0.5, Math.PI * 2).name('Rotate Z Axis');
//     cloudsFolder.open();
//   };

//   const controlSun = () => {
//     const lightParams = {
//       isLightOn: true
//     };

//     gui.add(lightParams, 'isLightOn').name('Sun Light').onChange((value) => {
//       if (value) {
//         sunLight.set(20, 20, 20);
//       } else {
//         sunLight.set(0, 0, 0);
//       }
//     });
//   };

//   const controlNumOfStars = () => {
//     const starParams = {
//       exampleProperty: 1000
//     };
//     gui.add(starParams, 'exampleProperty', 0, 10000).name('Number of Stars').step(1000).onChange((value) => {
//       createStars(value);
//     });
//   };

//   const controlGlowColor = () => {
//     fresnelMesh.rimHex = new THREE.Color(rimHex);

//     const glowParams = {
//       GlowColor: `#${fresnelMesh.rimHex.getHexString()}`
//     };

//     gui.addColor(glowParams, 'GlowColor').name("Color of Glow").onChange((value) => {
//       fresnelMesh.rimHex.set(value);
//       fresnelMesh.material.uniforms.color1.value.set(fresnelMesh.rimHex);
//       fresnelMesh.material.needsUpdate = true;
//     });
//   };

//   return (
//     <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
//   );
// };

// export default EarthVisualization;

//-----------------------------------------
import * as THREE from "three";
//import React, { useEffect, useRef } from 'react';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";
import { Color } from 'three';
import { GUI } from 'dat.gui';

let scene, camera, renderer, earthGroup, dayNight, cloudsMesh, fresnelMesh;

const dayMapJPG = './textures/00_earthmap1k.jpg';
const nightMapJPG = process.env.PUBLIC_URL + './textures/earth_lights_lrg.jpg';
const cloudMapJPG = process.env.PUBLIC_URL + './textures/05_earthcloudmaptrans.jpg';
let sunLight = new THREE.Vector3(20, 20, 20);
let rimHex = 0x4bc5c4;
const facingHex = 0x000000;
let starGroup = new THREE.Group();
let numOfStars = 1000;
const gui = new GUI();

function initScene() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  const fov = 75;
  const aspect = w / h;
  const near = 0.1;
  const far = 1000;

  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.updateProjectionMatrix();
  camera.position.z = 3;
}

function createEarth(dayMapJPG, nightMapJPG) {
  const textureLoader = new THREE.TextureLoader();
  //const dayMap = textureLoader.load(dayMapJPG);
  console.log(dayMapJPG);
  const dayMap = textureLoader.load(
    dayMapJPG,
    (texture) => {
      console.log('Texture loaded successfully:', texture);
    },
    undefined,
    (err) => {
      console.error('An error occurred while loading the texture:', err);
    }
  );
  const nightMap = textureLoader.load(nightMapJPG);
 
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayMap },
      nightTexture: { value: nightMap },
      lightDirection: { value: sunLight },
    },
    vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D dayTexture;
            uniform sampler2D nightTexture;
            uniform vec3 lightDirection;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vec3 lightDir = normalize(lightDirection);
                float lightIntensity = dot(vNormal, lightDir);
                lightIntensity = clamp(lightIntensity, 0.0, 1.0);
                vec4 dayColor = texture2D(dayTexture, vUv);
                vec4 nightColor = texture2D(nightTexture, vUv);
                vec4 finalColor = mix(nightColor, dayColor, lightIntensity);
                gl_FragColor = finalColor;
            }
        `,
    side: THREE.DoubleSide,
  });

  earthGroup = new THREE.Group();
  earthGroup.rotation.z = -23.4 * Math.PI / 180;

  dayNight = new THREE.Mesh(geometry, material);
  earthGroup.add(dayNight);

  scene.add(earthGroup);
}

function createGlow(rimHex, facingHex) {
  const fresnelMat = getFresnelMat({ rimHex: rimHex, facingHex: facingHex });
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  fresnelMesh = new THREE.Mesh(geometry, fresnelMat);
  fresnelMesh.scale.set(1.001, 1.001, 1.001);
  earthGroup.add(fresnelMesh);
}

function createClouds(cloudMapJPG) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const textureLoader = new THREE.TextureLoader();
  const cloudMap = textureLoader.load(cloudMapJPG);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const cloudsMat = new THREE.MeshStandardMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
  });

  cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
  cloudsMesh.scale.set(1.02, 1.02, 1.02);
  earthGroup.add(cloudsMesh);
}

function createStars(numOfStars) {
  if (starGroup) {
    scene.remove(starGroup);
    starGroup.children.forEach(star => star.geometry.dispose());
  }
  starGroup = new THREE.Group();
  let stars = getStarfield({ numStars: numOfStars });
  starGroup.add(stars);
  scene.add(starGroup);
}

function initControls() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.03;
}

function animate() {
  requestAnimationFrame(animate);

  dayNight.rotation.y += 0.0005;
  cloudsMesh.rotation.y -= 0.0003;

  renderer.render(scene, camera);
}

function init() {
  initScene();
  createEarth(dayMapJPG, nightMapJPG);
  createGlow(rimHex, facingHex);
  createClouds(cloudMapJPG);
  createStars(numOfStars);
  initControls();
  animate();
}

init();

function renderControls() {
  controlCloudRotation();
  controlSun();
  controlNumOfStars();
  controlGlowColor();
}

renderControls()

function controlCloudRotation() {
  const cloudsFolder = gui.addFolder("Clouds");
  cloudsFolder.add(cloudsMesh.rotation, 'x', -0.5, Math.PI * 2).name('Rotate X Axis');
  cloudsFolder.add(cloudsMesh.rotation, 'y', -0.5, Math.PI * 2).name('Rotate Y Axis');
  cloudsFolder.add(cloudsMesh.rotation, 'z', -0.5, Math.PI * 2).name('Rotate Z Axis');
  cloudsFolder.open();
}

function controlSun() {
  const lightParams = {
    isLightOn: true
  };

  gui.add(lightParams, 'isLightOn').name('Sun Light').onChange((value) => {
    if (value) {
      sunLight.set(20, 20, 20);
    } else {
      sunLight.set(0, 0, 0);
    }
  });
}

function controlNumOfStars() {
  const starParams = {
    exampleProperty: 1000
  };
  gui.add(starParams, 'exampleProperty', 0, 10000).name('Number of Stars').step(1000).onChange((value) => {
    createStars(value); // Call createStars with the new number of stars
  });
}

function controlGlowColor() {
  fresnelMesh.rimHex = new Color(rimHex);

  const glowParams = {
    GlowColor: `#${fresnelMesh.rimHex.getHexString()}`
  };

  gui.addColor(glowParams, 'GlowColor').name("Color of Glow").onChange((value) => {
    fresnelMesh.rimHex.set(value);
    fresnelMesh.material.uniforms.color1.value.set(fresnelMesh.rimHex);
    fresnelMesh.material.needsUpdate = true;
  });
}


