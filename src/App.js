import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid, Stats } from '@react-three/drei'
import * as THREE from 'three'
import Cutter from '@r3f-cutter/r3f-cutter'
import { useControls } from 'leva'

function Scene() {
  const boxRef = useRef()
  const boxMeshRef = useRef()
  const cutterRef = useRef()
  //
  const { cutPlanePosition } = useControls({
    cutPlanePosition: {
      value: 0,
      min: -2,
      max: 2,
      step: 0.01,
      onChange: (v) => {
        xPlane.constant = v
      }
    }
  })
  const [xPlane] = useState(new THREE.Plane(new THREE.Vector3(1, 0, 0), cutPlanePosition))

  useFrame((_, delta) => {
    boxRef.current.rotation.x += delta
    boxRef.current.rotation.y -= delta

    boxMeshRef.current.updateMatrix()
    boxMeshRef.current.updateMatrixWorld()
    boxMeshRef.current.rotation.x += delta
    boxMeshRef.current.rotation.y -= delta

    cutterRef.current.update()
  })
  return (
    <>
      <Cutter ref={cutterRef} plane={xPlane}>
        <mesh ref={boxRef} position={[0, 0.5, 0]} rotation={[0.0, 0.2, 0.0]}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Cutter>
      <mesh ref={boxMeshRef} matrixAutoUpdate={false} position={[0, 0.5, 0]} rotation={[0.0, 0.2, 0.0]}>
        <boxGeometry />
        <meshStandardMaterial color="black" wireframe />
      </mesh>
      <planeHelper args={[xPlane, 3, 0x999999]} />
    </>
  )
}

export default function App() {
  return (
    <Canvas gl={{ localClippingEnabled: true }} camera={{ fov: 45, near: 0.1, far: 1000, position: [-2.5, 2.5, 2.5] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Grid infiniteGrid cellSize={0.1} sectionSize={1} fadeDistance={10} sectionColor="darkgrey" />
      <Scene />
      <OrbitControls />
      <Stats />
    </Canvas>
  )
}
