import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";
import { getFresnelMat } from "./getFresnelMat.js";
import { Color } from 'three';
import { GUI } from 'dat.gui';

let scene, camera, renderer, earthGroup, dayNight, cloudsMesh, fresnelMesh;

const dayMapJPG = './textures/00_earthmap1k.jpg';
const nightMapJPG = './textures/earth_lights_lrg.jpg';
const cloudMapJPG = './textures/05_earthcloudmaptrans.jpg';
const fresnelMat = getFresnelMat();
const numOfStars = 50000;
console.log('fresnelMat:', fresnelMat);
console.log('rimHex:', fresnelMat.rimHex);

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
    camera.position.z = 3;
}

function createEarth(dayMapJPG, nightMapJPG) {
    const textureLoader = new THREE.TextureLoader();
    const dayMap = textureLoader.load(dayMapJPG);
    const nightMap = textureLoader.load(nightMapJPG);

    const geometry = new THREE.SphereGeometry(1, 64, 64);

    const material = new THREE.ShaderMaterial({
        uniforms: {
            dayTexture: { value: dayMap },
            nightTexture: { value: nightMap },
            lightDirection: { value: new THREE.Vector3(20, 20, 20) },
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

function createGlow() {
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
    const stars = getStarfield({ numStars: numOfStars });
    scene.add(stars);
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
    createGlow();
    createClouds(cloudMapJPG);
    createStars(numOfStars);
    initControls();
    animate();
}

init();

const gui = new GUI();
// const obj = {
//     exampleProperty: 0
// };
// gui.add(obj, 'exampleProperty', 0, 100);
const cloudsFolder = gui.addFolder("Clouds");
cloudsFolder.add(cloudsMesh.rotation, 'x', 0, Math.PI * 2).name('Rotate X Axis');
cloudsFolder.add(cloudsMesh.rotation, 'y', 0, Math.PI * 2).name('Rotate Y Axis');
cloudsFolder.add(cloudsMesh.rotation, 'z', 0, Math.PI * 2).name('Rotate Z Axis');



fresnelMat.rimHex = new Color(fresnelMat.rimHex);
console.log('Converted rimHex to THREE.Color:', fresnelMat.rimHex);

// Initialize glow parameters
const glowParams = {
    GlowColor: `#${fresnelMat.rimHex.getHexString()}` // Convert to hex string with '#'
};

// Add color control to dat.GUI
gui.addColor(glowParams, 'GlowColor').onChange((value) => {
    // Update the rimHex color using the new color from GUI
    fresnelMat.rimHex.set(value);
    console.log('Updated rimHex:', fresnelMat.rimHex);
});