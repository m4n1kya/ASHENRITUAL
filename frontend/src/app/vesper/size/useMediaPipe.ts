import { useEffect, useState, useRef } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export function useMediaPipe() {
  const [landmarker, setLandmarker] = useState<PoseLandmarker | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function initialize() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });

        setLandmarker(poseLandmarker);
      } catch (err) {
        console.error('MediaPipe initialization failed:', err);
        setError('Failed to load Size Intelligence vision models.');
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();
  }, []);

  return { landmarker, isInitializing, error };
}
