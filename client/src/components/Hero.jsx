import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ArrowRight, ShoppingBag, ChevronDown, Sparkles } from 'lucide-react'
import * as THREE from 'three'

// --- HIGHLY DETAILED REALISTIC PRODUCT MODEL BUILDERS ---
const ProductModel = ({ type }) => {
  // Memoizing shapes so they aren't recalculated dynamically on every single frame loop
  const shoeExtrudeSettings = useMemo(() => ({ steps: 1, depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 3 }), [])
  
  const shoeShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.6, -0.2)
    shape.lineTo(0.6, -0.2)
    shape.lineTo(0.5, 0.1)
    shape.quadraticCurveTo(0.3, 0.3, 0.1, 0.1)
    shape.lineTo(-0.3, 0.2)
    shape.lineTo(-0.6, 0.0)
    shape.closePath()
    return shape
  }, [])

  // --- TYPE 0: HIGH-END SMARTWATCH ---
  if (type === 0) {
    return (
      <group scale={[1.1, 1.1, 1.1]}>
        {/* Watch Strap / Band Loops */}
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[0.26, 1.3, 0.08]} />
          <meshStandardMaterial color="#0A224E" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Main Aluminum Hardware Metallic Case */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.55, 0.62, 0.14]} />
          <meshStandardMaterial color="#EBEBEB" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Curved Screen Glass Panel Shield */}
        <mesh position={[0, 0, 0.12]}>
          <boxGeometry args={[0.48, 0.54, 0.02]} />
          <meshStandardMaterial color="#A5CE00" roughness={0.05} metalness={0.9} transparent opacity={0.85} />
        </mesh>
        {/* Side Operational Digital Crown Dial Button */}
        <mesh position={[0.29, 0.1, 0.04]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.06, 16]} />
          <meshStandardMaterial color="#A5CE00" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    )
  }

  // --- TYPE 1: MODERN SLIM SMARTPHONE ---
  if (type === 1) {
    return (
      <group scale={[1, 1, 1]}>
        {/* Outer Matte Titanium Structural Frame Chassis */}
        <mesh>
          <boxGeometry args={[0.65, 1.3, 0.07]} />
          <meshStandardMaterial color="#0A224E" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Glossy Front Edge-to-Edge Display Screen */}
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.59, 1.24]} />
          <meshStandardMaterial color="#A5CE00" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Realistic Rear Camera Protruding Island Hub Bump */}
        <mesh position={[-0.16, 0.45, -0.05]}>
          <boxGeometry args={[0.22, 0.22, 0.03]} />
          <meshStandardMaterial color="#0A224E" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Individual Camera Optical Lenses */}
        <mesh position={[-0.16, 0.45, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 12]} />
          <meshStandardMaterial color="#EBEBEB" roughness={0.01} metalness={0.95} />
        </mesh>
      </group>
    )
  }

  // --- TYPE 2: LOW-POLY ATHLETIC SNEAKER ---
  if (type === 2) {
    return (
      <group scale={[0.85, 0.85, 0.85]} position={[0, -0.1, 0]}>
        {/* Extruded Detailed Foot Silhouette Outer Canvas Sole */}
        <mesh extrudePath={shoeShape}>
          <extrudeGeometry args={[shoeShape, shoeExtrudeSettings]} />
          <meshStandardMaterial color="#EBEBEB" roughness={0.4} metalness={0.1} flatShading />
        </mesh>
        {/* Layered Contrast Secondary Accents paneling */}
        <mesh position={[0, 0.02, 0.05]}>
          <boxGeometry args={[0.6, 0.25, 0.25]} />
          <meshStandardMaterial color="#A5CE00" roughness={0.5} metalness={0.2} />
        </mesh>
        {/* Bottom High-traction Under-sole Tread Layer */}
        <mesh position={[0, -0.22, 0.15]}>
          <boxGeometry args={[1.1, 0.06, 0.32]} />
          <meshStandardMaterial color="#0A224E" roughness={0.9} />
        </mesh>
      </group>
    )
  }

  // --- TYPE 3: DIGITAL DSLR MIRRORLESS CAMERA ---
  return (
    <group scale={[1.1, 1.1, 1.1]}>
      {/* Ergonomic Molded Matte Main Camera Body Handle Chassis */}
      <mesh>
        <boxGeometry args={[0.85, 0.55, 0.45]} />
        <meshStandardMaterial color="#0A224E" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Top Physical Control Dial / Shutter Trigger Mount */}
      <mesh position={[0.26, 0.29, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#EBEBEB" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Heavy Threaded Optic Focus Lens Element Assembly */}
      <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.32, 24]} />
        <meshStandardMaterial color="#EBEBEB" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Front Glass Reflection Element Rim Core */}
      <mesh position={[0, 0, 0.49]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 24]} />
        <meshStandardMaterial color="#A5CE00" roughness={0.05} metalness={0.95} />
      </mesh>
    </group>
  )
}

// --- HYPER E-COM STREAM GENERATOR ---
const EcomParticleStream = ({ scrollProgress }) => {
  const count = 35
  const targets = useRef([])

  if (targets.current.length === 0) {
    for (let i = 0; i < count; i++) {
      targets.current.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 11,
        z: Math.random() * -25,
        speed: 0.025 + Math.random() * 0.045,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        type: Math.floor(Math.random() * 4) // Cycle across Watch, Phone, Shoe, Camera evenly
      })
    }
  }

  return (
    <group>
      {targets.current.map((p, idx) => {
        const itemRef = useRef()
        
        useFrame((state) => {
          if (!itemRef.current) return
          
          // Speed scale multiplication linked straight into user layout scroll parameters
          const velocity = p.speed * (1 + scrollProgress * 7.5)
          itemRef.current.position.z += velocity

          // Clean backdrop looping vector calculations once an asset files out of camera frame boundaries
          if (itemRef.current.position.z > 5) {
            itemRef.current.position.z = -25
            itemRef.current.position.x = (Math.random() - 0.5) * 15
            itemRef.current.position.y = (Math.random() - 0.5) * 11
          }

          itemRef.current.rotation.x += p.rotSpeedX
          itemRef.current.rotation.y += p.rotSpeedY
        })

        return (
          <group key={idx} ref={itemRef} position={[p.x, p.y, p.z]}>
            <ProductModel type={p.type} />
          </group>
        )
      })}
    </group>
  )
}

// --- MAIN CENTRALIZED HERO COMPONENT ---
const Hero = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress(Math.min(window.scrollY / window.innerHeight, 1))
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight - 64,
      behavior: 'smooth'
    })
  }

  return (
    <section className="relative w-full min-h-screen bg-royal-main text-white flex items-center justify-center text-center overflow-hidden">
      
      {/* --- BACKGROUND LAYER: FULL-SCREEN INTERACTIVE 3D PARTICLES --- */}
      <div 
        className="absolute inset-0 w-full h-full z-0 transition-opacity duration-300"
        style={{ opacity: 1 - scrollProgress }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 55 }} gl={{ antialias: true }}>
          {/* Intense realistic lighting configurations to give true physical metallic depth */}
          <ambientLight intensity={0.6} />
          <pointLight position={[8, 12, 8]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-8, -6, -8]} intensity={1.5} color="#A5CE00" />
          <directionalLight position={[0, 6, 2]} intensity={1.2} color="#ffffff" />
          <spotLight position={[0, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#A5CE00" />
          
          <EcomParticleStream scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* --- FOREGROUND LAYER: CENTRALIZED INTUITIVE MARKUP --- */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="space-y-6 md:space-y-8 flex flex-col items-center text-center">
          
          {/* Dynamic Drop Alert System Badge */}
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] font-black bg-lime-accent text-royal-dark px-4 py-2 rounded-md uppercase shadow-2xl pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Premium Quality / 24/7 Support
          </div>
          
          {/* Big Bold Headline */}
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase leading-[0.95] drop-shadow-[0_12px_30px_rgba(10,34,78,0.65)]">
            The Art of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-accent via-white to-lime-accent bg-size-200 animate-pulse">
              Modern Living.
            </span>
          </h2>
          
          {/* Unified E-Commerce Context Copy */}
          <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-xl tracking-wide font-medium leading-relaxed drop-shadow-md">
            Discover curated collections that redefine elegance. From timeless classics to contemporary masterpieces, elevate your lifestyle with AVG's premium selection.
          </p>

          {/* Call to Action Interactive Box Button */}
          <div className="pt-4 pointer-events-auto">
            <a href='/allproducts'
              // onClick={handleScrollDown}
              className="group inline-flex items-center gap-3 bg-lime-accent text-royal-dark px-10 py-4 font-black tracking-widest uppercase rounded-xl text-xs hover:bg-white hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 shadow-[0_10px_35px_rgba(165,206,0,0.45)]"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SHIELD GRADIENT FOR DIRECT NEXT SECTION CONNECTION --- */}
      <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-t from-royal-dark via-royal-dark/40 to-transparent pointer-events-none z-10" />

      {/* Interactive Window Scroll Navigation Anchor */}
      <button 
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30 hover:text-lime-accent transition-colors duration-300 z-20 group pointer-events-auto"
        aria-label="Scroll down to e-commerce shelf"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-bold">Discover Catalog</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>

      {/* Modern Active Viewport Frame Sidebar HUD Overlays */}
      <div className="hidden xl:block absolute left-12 bottom-12 font-mono text-[9px] text-white/20 tracking-widest uppercase pointer-events-none">
        [ CATALOG // PREMIUM_STILL_RENDER ]
      </div>
      <div className="hidden xl:block absolute right-12 bottom-12 font-mono text-[9px] text-lime-accent/30 tracking-widest uppercase pointer-events-none">
        // 3D REALTIME CONTEXT STREAM ACTIVE
      </div>
    </section>
  )
}

export default Hero