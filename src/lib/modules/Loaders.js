import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {FontLoader} from "three/addons/loaders/FontLoader.js";

export function LoadGLTF(url, onProgress= () => null) {
    const gltfLoader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        gltfLoader.load(url, resolve, onProgress, reject);
    });
}

export function LoadFont(url, onProgress = () => null) {
    const fontLoader = new FontLoader();
    return new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, onProgress, reject);
    });
}