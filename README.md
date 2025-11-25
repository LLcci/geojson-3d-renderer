# geojson 3d renderer

A versatile 3D GeoJSON visualization library compatible with Three.js, Vue.js + Three.js, and TresJS environments. Provides Vue components, hooks, and utility functions for rendering GeoJSON data in 3D space with customizable materials.

[中文文档](README_CN.md)

[DEMO](https://llcci.github.io/geojson-3d-renderer-demo/)

## Features

- 🗺️ 3D GeoJSON visualization with Mercator projection
- 🎨 Customizable geometry generation (shapes and lines)
- ⚡ Vue 3 Composition API support
- 📦 Tree-shakable and lightweight
- 🔧 TypeScript support

## Installation

```bash
npm install geojson-3d-renderer
# or
yarn add geojson-3d-renderer
# or
pnpm add geojson-3d-renderer
```

## Usage

### Vue Component

> Requires Vue.js, Three.js, and TresJS environments

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
import { GeoJson } from 'geojson-3d-renderer'
</script>
```

#### Props

| name             | type             | default | required | description                                      |
| ---------------- | ---------------- | ------- | -------- | ------------------------------------------------ |
| `url`            | string           |         | true     | GeoJSON file URL                                 |
| `mercatorCenter` | [number, number] |         | true     | Mercator projection center coordinates           |
| `options`        | Options          |         | false    | Configuration options（See [Options](#options)） |

#### Events

| name             | type                                                                                    | description                                                                  |
| ---------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `geojson-error`  | any                                                                                     | Triggered when GeoJSON loading encounters an error                           |
| `geojson-result` | { mergedShapeGeometry: THREE.BufferGeometry, mergedLineGeometry: THREE.BufferGeometry } | Triggered when GeoJSON loading is successful, containing the merged geometry |

#### Slots

| name            | description                                    |
| --------------- | ---------------------------------------------- |
| `default`       | Custom content slot for additional elements    |
| `shapeGeometry` | Custom shape mesh slot for additional elements |
| `lineGeometry`  | Custom line mesh slot for additional elements  |

#### Exposes

| name           | type     | description                                            |
| -------------- | -------- | ------------------------------------------------------ |
| `isGeneration` | boolean  | Indicates if the geometry is currently being generated |
| `execute`      | ()=>void | Trigger the geometry generation process                |
| `dispose`      | ()=>void | Dispose resources and geometries                       |

### Composition API

> Requires Vue.js, Three.js environments

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
import { useGeojson } from 'geojson-3d-renderer'

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

#### Parameters

| name             | type             | default | required | description                                      |
| ---------------- | ---------------- | ------- | -------- | ------------------------------------------------ |
| `url`            | string           |         | true     | GeoJSON file URL                                 |
| `mercatorCenter` | [number, number] |         | true     | Mercator projection center coordinates           |
| `options`        | Options          |         | false    | Configuration options（See [Options](#options)） |

#### Returns

| name                  | type                                                                                                      | description                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `mergedShapeGeometry` | THREE.BufferGeometry                                                                                      | Merged shape geometry for fill rendering               |
| `mergedLineGeometry`  | THREE.BufferGeometry                                                                                      | Merged line geometry for line rendering                |
| `isGeneration`        | boolean                                                                                                   | Whether the geometry is currently being generated      |
| `onResult`            | (result: { mergedShapeGeometry: THREE.BufferGeometry, mergedLineGeometry: THREE.BufferGeometry }) => void | Callback function when geometry generation is complete |

| `onError` | (error: any) => void | Callback function when geometry generation encounters an error |
| `dispose` | ()=>void | Dispose resources and geometries |
| `execute` | ()=>void | Trigger the geometry generation process |

### Utility Function

> Requires Three.js environment

```javascript
import { genGeojsonGeometry } from 'geojson-3d-renderer/utils'

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

#### Parameters

| name             | type             | default | required | description                                      |
| ---------------- | ---------------- | ------- | -------- | ------------------------------------------------ |
| `url`            | string           |         | true     | GeoJSON file URL                                 |
| `mercatorCenter` | [number, number] |         | true     | Mercator projection center coordinates           |
| `options`        | Options          |         | false    | Configuration options（See [Options](#options)） |

#### Returns

| name                  | type                 | description                              |
| --------------------- | -------------------- | ---------------------------------------- |
| `mergedShapeGeometry` | THREE.BufferGeometry | Merged shape geometry for fill rendering |
| `mergedLineGeometry`  | THREE.BufferGeometry | Merged line geometry for line rendering  |

## Options

| name                | type             | default | description                                                                                              |
| ------------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `mercatorScale`     | number           | 30      | Mercator projection scale                                                                                |
| `mercatorTranslate` | [number, number] | [0, 0]  | Translation offset                                                                                       |
| `extrudeDepth`      | number           | 1       | Geometry extrusion depth                                                                                 |
| `lineOffset`        | number           | 0.01    | Line offset above geometry                                                                               |
| `needShapeGeometry` | boolean          | true    | Whether to generate fill geometry                                                                        |
| `needLineGeometry`  | boolean          | true    | Whether to generate line geometry                                                                        |
| `refresh`           | boolean          | false   | Refresh on change, only applicable to Composition API and Vue Component, and parameters must be reactive |
| `immediate`         | boolean          | true    | Load immediately, only applicable to Composition API and Vue Component                                   |

## License

MIT
