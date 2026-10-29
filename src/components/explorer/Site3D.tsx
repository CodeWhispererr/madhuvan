import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { avenueTrees, boundary, gate, parks, roads, type Pt } from '../../data/layout';
import { statusLabel } from '../../data/plotStatus';
import { centroid, plotInfos, type PlotInfo } from '../../lib/plots';
import { sizeFill, statusFill, sunFill, type MapMode } from './mapStyle';

// Layout x → three x, layout y (down the drawing) → three z, height → three y.

function shapeOf(poly: readonly Pt[]) {
  const shape = new THREE.Shape();
  poly.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, -y) : shape.lineTo(x, -y)));
  shape.closePath();
  return shape;
}

function slab(poly: readonly Pt[], depth: number) {
  const geo = new THREE.ExtrudeGeometry(shapeOf(poly), { depth, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  return geo;
}

const PLOT_HEIGHT = 1.6;

function Plot({
  plot,
  color,
  dim,
  hovered,
  selected,
  onHover,
  onSelect,
}: {
  plot: PlotInfo;
  color: string;
  dim: boolean;
  hovered: boolean;
  selected: boolean;
  onHover: (no: number | null) => void;
  onSelect: (no: number) => void;
}) {
  const geo = useMemo(() => slab(plot.polygon, PLOT_HEIGHT), [plot.polygon]);
  // Outline every plot so neighbours of the same colour read as separate plots.
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 15), [geo]);
  const lift = hovered || selected ? 0.9 : 0;
  return (
    <group position={[0, 0.3 + lift, 0]}>
    <mesh
      geometry={geo}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(plot.no);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(plot.no);
      }}
    >
      <meshStandardMaterial
        color={selected ? '#c9a24a' : color}
        transparent={dim}
        opacity={dim ? 0.18 : 1}
        roughness={0.7}
        emissive={hovered ? '#ffffff' : '#000000'}
        emissiveIntensity={hovered ? 0.12 : 0}
      />
    </mesh>
    <lineSegments geometry={edges} raycast={() => null}>
      <lineBasicMaterial color="#13261b" transparent opacity={dim ? 0.12 : 0.55} />
    </lineSegments>
    </group>
  );
}

function Tree({ at, scale = 1 }: { at: Pt; scale?: number }) {
  return (
    <group position={[at[0], 0, at[1]]} scale={scale}>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.18, 0.25, 2.8, 6]} />
        <meshStandardMaterial color="#7a5b3e" />
      </mesh>
      <mesh position={[0, 3.6, 0]}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color="#4f8f3f" flatShading />
      </mesh>
    </group>
  );
}

function parkTrees(poly: readonly Pt[], spacing = 7, inset = 3): Pt[] {
  const [cx, cy] = centroid(poly);
  const out: Pt[] = [];
  poly.forEach(([x1, y1], i) => {
    const [x2, y2] = poly[(i + 1) % poly.length];
    const n = Math.floor(Math.hypot(x2 - x1, y2 - y1) / spacing);
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) / n;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      const d = Math.hypot(cx - px, cy - py) || 1;
      out.push([px + ((cx - px) / d) * inset, py + ((cy - py) / d) * inset]);
    }
  });
  return out;
}

/** The entrance: twin slanted pylons, canopies and the central feature wall. */
function Gate() {
  const [x, z] = gate.at;
  return (
    <group position={[x, 0, z - 2]}>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 4.6, 5, 0]} rotation={[0, 0, -side * 0.16]}>
            <boxGeometry args={[1.3, 10, 1.3]} />
            <meshStandardMaterial color="#fbfaf6" />
          </mesh>
          <mesh position={[side * 10.5, 9.9, 0]}>
            <boxGeometry args={[11, 0.7, 3.2]} />
            <meshStandardMaterial color="#fbfaf6" />
          </mesh>
          <mesh position={[side * 10.5, 9.4, 0]}>
            <boxGeometry args={[10.6, 0.4, 3]} />
            <meshStandardMaterial color="#7c5b3d" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[2.6, 8.4, 0.7]} />
        <meshStandardMaterial color="#4a4f4a" />
      </mesh>
      <mesh position={[0, 6.2, -0.4]}>
        <boxGeometry args={[1.8, 2.2, 0.1]} />
        <meshStandardMaterial color="#c9a24a" />
      </mesh>
      <Html position={[0, 13, 0]} center distanceFactor={160} zIndexRange={[10, 0]}>
        <span className="map3d__label">Main Gate</span>
      </Html>
    </group>
  );
}

interface Site3DProps {
  mode: MapMode;
  matches: (p: PlotInfo) => boolean;
  selected: number | null;
  onSelect: (no: number) => void;
}

export default function Site3D({ mode, matches, selected, onSelect }: Site3DProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const ground = useMemo(() => slab(boundary, 0.3), []);
  const roadGeos = useMemo(() => roads.map((r) => ({ id: r.id, main: r.main, geo: slab(r.polygon, 0.12) })), []);
  const parkGeos = useMemo(() => parks.map((p) => ({ id: p.id, geo: slab(p.polygon, 0.2), trees: parkTrees(p.polygon), park: p })), []);
  const hoveredPlot = hovered !== null ? plotInfos.find((p) => p.no === hovered) : undefined;

  return (
    <Canvas
      className="map3d"
      dpr={[1, 2]}
      camera={{ position: [110, 150, -90], fov: 38, near: 1, far: 2000 }}
      onPointerMissed={() => setHovered(null)}
    >
      <color attach="background" args={['#eef2e8']} />
      <fog attach="fog" args={['#eef2e8', 420, 900]} />
      <hemisphereLight args={['#ffffff', '#b9c7a8', 1.1]} />
      <directionalLight position={[-120, 200, -60]} intensity={1.6} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-40, -0.05, 90]}>
        <planeGeometry args={[900, 900]} />
        <meshStandardMaterial color="#dfe7d4" />
      </mesh>
      <mesh geometry={ground}>
        <meshStandardMaterial color="#cfe0bd" />
      </mesh>

      {roadGeos.map((r) => (
        <mesh key={r.id} geometry={r.geo} position={[0, r.main ? 0 : 0.3, 0]}>
          <meshStandardMaterial color={r.main ? '#5f645f' : '#c9c5ba'} />
        </mesh>
      ))}

      {parkGeos.map(({ id, geo, trees, park }) => (
        <group key={id}>
          <mesh geometry={geo} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#9fcb7c" />
          </mesh>
          {trees.map((t, i) => (
            <Tree key={i} at={t} scale={i % 3 === 0 ? 1.15 : 0.9} />
          ))}
          <Html position={[park.labelAt[0], 8, park.labelAt[1]]} center distanceFactor={160} zIndexRange={[10, 0]}>
            <span className="map3d__label map3d__label--park">{park.name}</span>
          </Html>
        </group>
      ))}

      {avenueTrees.map((t, i) => (
        <Tree key={`a${i}`} at={t} scale={0.75} />
      ))}

      {plotInfos.map((p) => (
        <Plot
          key={p.no}
          plot={p}
          color={mode === 'availability' ? statusFill[p.status] : mode === 'size' ? sizeFill[p.size] : sunFill(Math.min(1, p.sun.annual / 12))}
          dim={!matches(p)}
          hovered={hovered === p.no}
          selected={selected === p.no}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}

      <Gate />

      {hoveredPlot && (
        <Html position={[hoveredPlot.centroid[0], 6, hoveredPlot.centroid[1]]} center zIndexRange={[20, 0]}>
          <div className="map3d__tip">
            <strong>Plot {hoveredPlot.no}</strong>
            <span>
              {statusLabel[hoveredPlot.status]} · {hoveredPlot.sizeLabel}
            </span>
          </div>
        </Html>
      )}

      <OrbitControls
        target={[-45, 0, 95]}
        enableDamping
        maxPolarAngle={Math.PI / 2.25}
        minDistance={60}
        maxDistance={520}
      />
    </Canvas>
  );
}
