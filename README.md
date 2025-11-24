# tres geojson 3d

A versatile 3D GeoJSON visualization library compatible with Three.js, Vue.js + Three.js, and TresJS environments. Provides Vue components, hooks, and utility functions for rendering GeoJSON data in 3D space.

## Features

- 🗺️ 3D GeoJSON visualization with Mercator projection
- 🎨 Customizable geometry generation (shapes and lines)
- ⚡ Vue 3 Composition API support
- 📦 Tree-shakable and lightweight
- 🔧 TypeScript support

## Installation

```bash
npm install tres-geojson-3d
# or
yarn add tres-geojson-3d
# or
pnpm add tres-geojson-3d
```

## Usage

### Vue Component

```vue
<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[0, 0, 50]" />
    <OrbitControls />
    <GeoJson
      url="https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json"
      :mercator-center="[104.0, 37.5]"
      :options="{
        mercatorScale: 30,
        extrudeDepth: 1,
        lineOffset: 0.01,
      }"
    />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas, TresPerspectiveCamera } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { GeoJson } from 'tres-geojson-3d'
</script>
```

### Composition API

```vue
<template>
  <TresCanvas>
    <TresPerspectiveCamera :position="[0, 0, 50]" />
    <OrbitControls />
    <TresGroup>
      <TresMesh v-if="shapeGeometry" :geometry="shapeGeometry">
        <TresMeshBasicMaterial color="#409EFF" />
      </TresMesh>
      <TresLineSegments v-if="lineGeometry" :geometry="lineGeometry">
        <TresLineBasicMaterial color="#000000" />
      </TresLineSegments>
    </TresGroup>
  </TresCanvas>
</template>

<script setup>
import {
  TresCanvas,
  TresPerspectiveCamera,
  TresGroup,
  TresMesh,
  TresLineSegments,
} from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import { useGeojson } from 'tres-geojson-3d'

const { mergedShapeGeometry: shapeGeometry, mergedLineGeometry: lineGeometry } = useGeojson(
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json',
  [104.0, 37.5],
  {
    mercatorScale: 30,
    extrudeDepth: 1,
    lineOffset: 0.01,
  }
)
</script>
```

### Utility Function

```javascript
import { genGeojsonGeometry } from 'tres-geojson-3d/utils'

const { mergedShapeGeometry, mergedLineGeometry } = await genGeojsonGeometry(
  'https://geo.datav.aliyun.com/areas_v3/bound/100000_full_city.json',
  [104.0, 37.5],
  {
    mercatorScale: 30,
    extrudeDepth: 1,
    lineOffset: 0.01,
  }
)
```

## API Reference

### GeoJson Component Props

- `url` (string): GeoJSON file URL
- `mercatorCenter` ([number, number]): Mercator projection center coordinates
- `options` (Options): Configuration options

### useGeojson Hook

Returns reactive geometry objects and event handlers.

### Options

```typescript
interface Options {
  mercatorScale: number // Mercator projection scale (default: 30)
  mercatorTranslate: [number, number] // Translation offset (default: [0, 0])
  extrudeDepth: number // Geometry extrusion depth (default: 1)
  lineOffset: number // Line offset above geometry (default: 0.01)
  needShapeGeometry?: boolean // Generate shape geometry (default: true)
  needLineGeometry?: boolean // Generate line geometry (default: true)
}
```

## License

MIT
