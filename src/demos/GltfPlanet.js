import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useLoader, useFrame, useThree, extend } from 'react-three-fiber'
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useGLTF } from '@react-three/drei'

// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// function draco(url = 'https://www.gstatic.com/draco/v1/decoders/') {
//   // or '/draco-gltf/'
//   return (loader) => {
//     const dracoLoader = new DRACOLoader()
//     dracoLoader.setDecoderPath(url)
//     loader.setDRACOLoader(dracoLoader)
//   }
// }

import planet from '../resources/gltf/planet.gltf'
//useLoader.preload(GLTFLoader, planet, draco())
//useGLTF.preload(planet, draco())
useGLTF.preload(planet)

function Planet(props) {
  const group = useRef()
  //const { nodes, materials } = useLoader(GLTFLoader, planet, draco())
  //const { nodes, materials } = useGLTF(planet, draco())
  const { nodes, materials } = useGLTF(planet)

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[0, 0.02, -6.33]} rotation={[0.24, -0.55, 0.56]} scale={[7, 7, 7]}>
          <mesh material={materials.scene} geometry={nodes['planet001_1'].geometry} />
          <mesh material={materials.scene} geometry={nodes['planet001_2'].geometry} />
        </group>
      </group>
    </group>
  )
}

function Stars({ count = 5000 }) {
  const positions = useMemo(() => {
    let positions = []
    for (let i = 0; i < count; i++) {
      positions.push((50 + Math.random() * 1000) * (Math.round(Math.random()) ? -1 : 1))
      positions.push((50 + Math.random() * 1000) * (Math.round(Math.random()) ? -1 : 1))
      positions.push((50 + Math.random() * 1000) * (Math.round(Math.random()) ? -1 : 1))
    }
    return new Float32Array(positions)
  }, [count])

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" size={2} sizeAttenuation color="white" transparent opacity={0.8} fog={false} />
    </points>
  )
}

extend({ OrbitControls })
const Controls = (props) => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}

export default function App() {
  return (
    <Canvas
      colorManagement={false}
      style={{ background: 'radial-gradient(at 50% 70%, #200f20 40%, #090b1f 80%, #050523 100%)' }}
      camera={{ position: [0, 0, 15] }}
      shadowMap
    >
      <ambientLight intensity={0.4} />
      <pointLight intensity={20} position={[-10, -25, -10]} color="#200f20" />
      <spotLight
        castShadow
        intensity={4}
        angle={Math.PI / 8}
        position={[15, 25, 5]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <fog attach="fog" args={['#090b1f', 0, 25]} />
      <Suspense fallback={null}>
        <Planet />
      </Suspense>
      <Stars />
      <Controls
        autoRotate
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
