/**
 * @fileoverview ASHENRITUAL Vesper Mirror — Three.js WebGL Garment Renderer
 * @module GarmentRenderer.ts
 *
 * Implements high-fidelity 3D garment rendering with luxury cloth shaders,
 * accurate collar/shoulder anatomical normalization, and studio rim lighting.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export interface GarmentMeshStats {
  vertices: number;
  triangles: number;
  drawCalls: number;
}

export type GarmentFinishStyle = "OBSIDIAN" | "ALABASTER";

export class GarmentRenderer {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer | null = null;
  public rootGroup: THREE.Group;
  public currentModel: THREE.Group | null = null;
  public finishStyle: GarmentFinishStyle = "OBSIDIAN";

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
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 4. Lights (Editorial High-Fashion Dark Luxury Setup)
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    // Key light (soft warm top-front)
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(0.6, 2.0, 2.4);
    this.scene.add(keyLight);

    // Fill light (subtle cool fill from left)
    const fillLight = new THREE.DirectionalLight(0xccd6ff, 1.1);
    fillLight.position.set(-1.4, 0.6, 1.8);
    this.scene.add(fillLight);

    // Rim light 1 (sharp edge separation from behind)
    const rimLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight1.position.set(1.5, 1.8, -1.8);
    this.scene.add(rimLight1);

    // Rim light 2 (secondary rim for silhouette definition)
    const rimLight2 = new THREE.DirectionalLight(0xe8e8ff, 1.8);
    rimLight2.position.set(-1.5, 1.4, -1.8);
    this.scene.add(rimLight2);

    // Bottom bounce light
    const bounceLight = new THREE.DirectionalLight(0x333338, 0.6);
    bounceLight.position.set(0, -1.8, 1.0);
    this.scene.add(bounceLight);

    // 5. Root garment container
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = "VesperMirror_RootGroup";
    this.scene.add(this.rootGroup);

    // 6. Loaders setup with robust CDN Draco decoders
    this.dracoLoader = new DRACOLoader();
    try {
      this.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    } catch {
      this.dracoLoader.setDecoderPath("/draco/");
    }

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  public resize(width: number, height: number) {
    if (!this.renderer || this.isDisposed || height <= 0 || width <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  public setFinishStyle(style: GarmentFinishStyle) {
    this.finishStyle = style;
    if (this.currentModel) {
      this.applyLuxuryMaterials(this.currentModel, this.currentModelPath || "");
    }
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

          // Calculate precise bounding box
          const bbox = new THREE.Box3().setFromObject(rawScene);
          const center = bbox.getCenter(new THREE.Vector3());
          const size = bbox.getSize(new THREE.Vector3());

          // CRITICAL ALIGNMENT FIX:
          // In upper garments, the collar line (suprasternal notch) is near the top of the mesh.
          // By offsetting the scene so the neck/collar sits at local Y=0,
          // the PoseEngine can directly position the root at the detected neck/shoulder landmark.
          const collarAnchorY = bbox.max.y - size.y * 0.08;
          rawScene.position.set(-center.x, -collarAnchorY, -center.z);

          // Apply editorial luxury shaders
          this.applyLuxuryMaterials(rawScene, modelPath);

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

  /**
   * Transforms raw 3D mesh materials into editorial Quiet Luxury cloth / leather
   */
  private applyLuxuryMaterials(obj: THREE.Object3D, modelPath: string) {
    const isPuffa = modelPath.includes("puffa");
    const isLeather = modelPath.includes("leather");
    const isSuit = modelPath.includes("suit");
    const isAlabaster = this.finishStyle === "ALABASTER";

    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (isAlabaster) {
          // Pure Architectural Alabaster: Frosted white sculptural cloth
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xf6f6f8,
            roughness: 0.35,
            metalness: 0.08,
            emissive: 0x222225,
            emissiveIntensity: 0.25,
            transparent: true,
            opacity: 0.94,
          });
          return;
        }

        // Luxury Obsidian / Stealth Palette
        if (isPuffa) {
          // Replace garish yellow puffer with stealth architectural matte carbon puffer
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x121215,
            roughness: 0.62,
            metalness: 0.15,
            emissive: 0x050508,
            emissiveIntensity: 0.15,
          });
          return;
        }

        if (isLeather) {
          // Supple lambskin leather with directional sheen
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x0b0b0d,
            roughness: 0.38,
            metalness: 0.22,
          });
          return;
        }

        if (isSuit) {
          // Deep charcoal worsted wool
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0x16171a,
            roughness: 0.78,
            metalness: 0.04,
          });
          return;
        }

        // Standard enhancement for other garments (tees, shirts, bombers)
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          for (const mat of materials) {
            if (mat instanceof THREE.MeshStandardMaterial) {
              // Dim down overly bright textures to fit ASHEN palette
              if (mat.color.r > 0.4 && mat.color.g > 0.4 && mat.color.b < 0.2) {
                // Detected garish yellow or bright color -> convert to dark graphite
                mat.color.setHex(0x141416);
              }
              mat.roughness = Math.max(mat.roughness, 0.55);
              mat.metalness = Math.min(mat.metalness, 0.2);
              mat.needsUpdate = true;
            }
          }
        }
      }
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
            const m = mat as THREE.Material & {
              map?: { dispose?: () => void };
              normalMap?: { dispose?: () => void };
              roughnessMap?: { dispose?: () => void };
              metalnessMap?: { dispose?: () => void };
            };
            if (m.map && typeof m.map.dispose === "function") m.map.dispose();
            if (m.normalMap && typeof m.normalMap.dispose === "function") m.normalMap.dispose();
            if (m.roughnessMap && typeof m.roughnessMap.dispose === "function") m.roughnessMap.dispose();
            if (m.metalnessMap && typeof m.metalnessMap.dispose === "function") m.metalnessMap.dispose();
            mat.dispose();
          }
        }
      }
    });
  }

  public dispose() {
    this.isDisposed = true;
    this.clearCurrentModel();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }
}
