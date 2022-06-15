import * as THREE from "three";
import { VRButton } from "./VRButton.js";
import { XRHandModelFactory } from "./handy-js/XRHandModelFactory.js";
import { Handy } from "./handy-js/src/Handy.js";
import { ThereminAudio } from "./audio.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { getTextOfJSDocComment } from "typescript";

export async function load() {}

let thereminAudio;
let thereminModel;

export async function go() {
  const container = document.getElementById("container");
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    500
  );
  scene.add(camera);

  prepScene(renderer, scene);

  container.appendChild(VRButton.createButton(renderer));
  renderer.xr.enabled = true;
  renderer.xr.cameraAutoUpdate = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    update(renderer);
  });

  const loader = new GLTFLoader();
  const path = "./theremin.glb";
  loader.load(path, (gltf) => {
    gltf.scene.scale.set(.05, .05, .05);
    gltf.scene.position.set(0,.8,0);
    scene.add(gltf.scene);

    thereminModel = gltf.scene;
  });
}

let hand1, hand2;

let leftHand;
let rightHand;

let floorMaterial;

async function prepScene(renderer, scene) {
  const floorGeometry = new THREE.PlaneGeometry(4, 4);
  floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

  const handModelFactory = new XRHandModelFactory();
  hand1 = renderer.xr.getHand(0);
  hand1.add(handModelFactory.createHandModel(hand1, "mesh"));
  scene.add(hand1);

  hand2 = renderer.xr.getHand(1);
  hand2.add(handModelFactory.createHandModel(hand2, "mesh"));
  scene.add(hand2);

  Handy.makeHandy(hand1);
  Handy.makeHandy(hand2);

}

function update() {
  if (!thereminAudio && window.audioContext) {
    thereminAudio = new ThereminAudio(window.audioContext);
    thereminAudio.toggle();
  }

  Handy.update();
  leftHand = Handy.hands.getLeft();
  rightHand = Handy.hands.getRight();

  if (leftHand) {
    const { y } = leftHand.joints['index-finger-metacarpal'].position;
    const min = 1.35;
    const max = 1.6;

    const scale = Math.max(0,Math.min((y-min)/(max-min),1));
    thereminAudio.setGain(scale);
    console.log('gain', y,thereminAudio.getGain());

    // console.log('lhp', leftHand.joints['index-finger-metacarpal'].position);
  }

  if (rightHand) {
    const { x } = rightHand.joints['index-finger-metacarpal'].position;
    const min = -0.2;
    const max = .28;

    const scale = Math.max(0,Math.min((x-min)/(max-min),1));


    thereminAudio.setFrequency(scale);
    // console.log('rhp', rightHand.joints['index-finger-metacarpal'].position);
    console.log('freq', x,thereminAudio.getFrequency());
  }
}