/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Three.js WebGL Garment Renderer
 * @module GarmentRenderer.ts
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export interface GarmentMeshStats {
  vertices: number;
  triangles: number;
  drawCalls: number;
}

export class GarmentRenderer {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer | null = null;
  public rootGroup: THREE.Group;
  public currentModel: THREE.Group | null = null;

  private canvas: HTMLCanvasElement;
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private isDisposed = false;
  private currentModelPath: string | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera (50 deg FOV standard portrait camera)
    const aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 2.5);
    this.camera.lookAt(0, 0, 0);

    // 3. Renderer with high performance and transparency
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 4. Lights (Editorial High-Fashion Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    // Key light (soft warm top-front)
    const keyLight = new THREE.DirectionalLight(0xfffbf5, 1.6);
    keyLight.position.set(0.8, 1.8, 2.2);
    this.scene.add(keyLight);

    // Fill light (subtle cool fill from left)
    const fillLight = new THREE.DirectionalLight(0xdde5ff, 0.9);
    fillLight.position.set(-1.2, 0.4, 1.8);
    this.scene.add(fillLight);

    // Rim light (highlight silhouette from behind)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
    rimLight.position.set(0, 1.5, -2.0);
    this.scene.add(rimLight);

    // Bottom bounce light
    const bounceLight = new THREE.DirectionalLight(0x222222, 0.5);
    bounceLight.position.set(0, -1.5, 1.0);
    this.scene.add(bounceLight);

    // 5. Root garment container
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = "VesperMirror_RootGroup";
    this.scene.add(this.rootGroup);

    // 6. Loaders setup
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/draco/");
    this.dracoLoader.setDecoderConfig({ type: "js" });

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  public resize(width: number, height: number) {
    if (!this.renderer || this.isDisposed || height <= 0 || width <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  public async loadGarment(
    modelPath: string,
    onProgress?: (percent: number) => void
  ): Promise<GarmentMeshStats> {
    if (this.currentModelPath === modelPath && this.currentModel) {
      return this.computeMeshStats(this.currentModel);
    }
    this.currentModelPath = modelPath;

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        modelPath,
        (gltf) => {
          if (this.isDisposed) return;

          // Dispose existing model cleanly
          this.clearCurrentModel();

          const rawScene = gltf.scene;
          const wrapper = new THREE.Group();
          wrapper.name = `GarmentWrapper_${modelPath}`;

          // Normalize garment orientation & center bounding box
          const bbox = new THREE.Box3().setFromObject(rawScene);
          const center = bbox.getCenter(new THREE.Vector3());
          const size = bbox.getSize(new THREE.Vector3());

          // Offset geometry so its neck/shoulder collar line sits near local origin
          // Typically upper garments have neck at ~top 20%
          const collarOffsetY = center.y + size.y * 0.32;
          rawScene.position.set(-center.x, -collarOffsetY, -center.z);

          // Enhance materials for luxury matte cloth rendering
          rawScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              if (mesh.material) {
                const materials = Array.isArray(mesh.material)
                  ? mesh.material
                  : [mesh.material];

                for (const mat of materials) {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.roughness = Math.max(mat.roughness, 0.65);
                    mat.metalness = Math.min(mat.metalness, 0.25);
                    mat.needsUpdate = true;
                  }
                }
              }
            }
          });

          wrapper.add(rawScene);
          this.rootGroup.add(wrapper);
          this.currentModel = wrapper;

          const stats = this.computeMeshStats(wrapper);
          resolve(stats);
        },
        (xhr) => {
          if (xhr.total > 0 && onProgress) {
            onProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (error) => {
          console.error("Vesper GarmentRenderer: Failed to load GLB model:", error);
          reject(error);
        }
      );
    });
  }

  public clearCurrentModel() {
    if (this.currentModel) {
      this.rootGroup.remove(this.currentModel);
      this.disposeObject(this.currentModel);
      this.currentModel = null;
    }
    this.currentModelPath = null;
  }

  public render() {
    if (!this.renderer || this.isDisposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  public computeMeshStats(obj: THREE.Object3D): GarmentMeshStats {
    let vertices = 0;
    let triangles = 0;
    let drawCalls = 0;

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        drawCalls++;
        if (mesh.geometry) {
          const geom = mesh.geometry;
          if (geom.index) {
            triangles += geom.index.count / 3;
          } else if (geom.attributes.position) {
            triangles += geom.attributes.position.count / 3;
          }
          if (geom.attributes.position) {
            vertices += geom.attributes.position.count;
          }
        }
      }
    });

    return {
      vertices: Math.round(vertices),
      triangles: Math.round(triangles),
      drawCalls,
    };
  }

  private disposeObject(obj: THREE.Object3D) {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          for (const mat of materials) {
            if (mat.map) mat.map.dispose();
            if (mat.normalMap) mat.normalMap.dispose();
            if (mat.roughnessMap) mat.roughnessMap.dispose();
            if (mat.metalnessMap) mat.metalnessMap.dispose();
            mat.dispose();
          }
        }
      }
    });
  }

  public dispose() {
    this.isDisposed = true;
    this.clearCurrentModel();
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
