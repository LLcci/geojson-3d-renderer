# geojson 3d renderer

一个功能强大的 3D GeoJSON 可视化库，兼容 Three.js、Vue.js + Three.js 和 TresJS 环境。提供 Vue 组件、钩子和工具函数，用于在 3D 空间中渲染 GeoJSON 数据，并支持自定义材质。

[演示示例](https://llcci.github.io/geojson-3d-renderer-demo/)

## 特性

- 🗺️ 基于墨卡托投影的 3D GeoJSON 可视化
- 🎨 可自定义的几何体生成（形状和线条）
- ⚡ Vue 3 Composition API 支持
- 📦 支持 Tree-shaking，轻量级
- 🔧 TypeScript 支持

## 安装

```bash
npm install geojson-3d-renderer
# 或
yarn add geojson-3d-renderer
# 或
pnpm add geojson-3d-renderer
```

## 使用方法

### Vue 组件

> 需要在 Vue.js、Three.js 和 TresJS 环境中使用

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

#### 属性 (Props)

| 属性名           | 类型             | 默认值 | 是否必需 | 描述                          |
| ---------------- | ---------------- | ------ | -------- | ----------------------------- |
| `url`            | string           | -      | 是       | GeoJSON 文件 URL              |
| `mercatorCenter` | [number, number] | -      | 是       | 墨卡托投影中心坐标            |
| `options`        | Options          | -      | 否       | 配置选项（详见[选项](#选项)） |

#### 事件 (Events)

| 事件名           | 类型                                                                                    | 描述                                     |
| ---------------- | --------------------------------------------------------------------------------------- | ---------------------------------------- |
| `geojson-error`  | any                                                                                     | GeoJSON 加载错误时触发                   |
| `geojson-result` | { mergedShapeGeometry: THREE.BufferGeometry, mergedLineGeometry: THREE.BufferGeometry } | GeoJSON 加载成功时触发，包含合并的几何体 |

#### 插槽 (Slots)

| 插槽名          | 描述                             |
| --------------- | -------------------------------- |
| `default`       | 自定义内容插槽，用于添加额外元素 |
| `shapeGeometry` | 自定义形状几何体插槽             |
| `lineGeometry`  | 自定义线几何体插槽               |

#### 暴露的方法 (Exposes)

| 方法名         | 类型     | 描述                   |
| -------------- | -------- | ---------------------- |
| `isGeneration` | boolean  | 指示几何体是否正在生成 |
| `execute`      | ()=>void | 触发几何体生成过程     |
| `dispose`      | ()=>void | 释放资源和几何体       |

### Composition API

> 需要在 Vue.js、Three.js 环境中使用

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

#### 参数 (Parameters)

| 参数名           | 类型             | 默认值 | 是否必需 | 描述                          |
| ---------------- | ---------------- | ------ | -------- | ----------------------------- |
| `url`            | string           | -      | 是       | GeoJSON 文件 URL              |
| `mercatorCenter` | [number, number] | -      | 是       | 墨卡托投影中心坐标            |
| `options`        | Options          | -      | 否       | 配置选项（详见[选项](#选项)） |

#### 返回值 (Returns)

| 返回值名              | 类型                                                                                                      | 描述                           |
| --------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `mergedShapeGeometry` | THREE.BufferGeometry                                                                                      | 用于填充渲染的合并形状几何体   |
| `mergedLineGeometry`  | THREE.BufferGeometry                                                                                      | 用于线条渲染的合并线几何体     |
| `isGeneration`        | boolean                                                                                                   | 几何体是否正在生成             |
| `onResult`            | (result: { mergedShapeGeometry: THREE.BufferGeometry, mergedLineGeometry: THREE.BufferGeometry }) => void | 几何体生成完成时的回调函数     |
| `onError`             | (error: any) => void                                                                                      | 几何体生成遇到错误时的回调函数 |
| `dispose`             | ()=>void                                                                                                  | 释放资源和几何体               |
| `execute`             | ()=>void                                                                                                  | 触发几何体生成过程             |

### 工具函数 (Utility Function)

> 需要在 Three.js 环境中使用

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

#### 参数 (Parameters)

| 参数名           | 类型             | 默认值 | 是否必需 | 描述                          |
| ---------------- | ---------------- | ------ | -------- | ----------------------------- |
| `url`            | string           | -      | 是       | GeoJSON 文件 URL              |
| `mercatorCenter` | [number, number] | -      | 是       | 墨卡托投影中心坐标            |
| `options`        | Options          | -      | 否       | 配置选项（详见[选项](#选项)） |

#### 返回值 (Returns)

| 返回值名              | 类型                 | 描述                         |
| --------------------- | -------------------- | ---------------------------- |
| `mergedShapeGeometry` | THREE.BufferGeometry | 用于填充渲染的合并形状几何体 |
| `mergedLineGeometry`  | THREE.BufferGeometry | 用于线条渲染的合并线几何体   |

## 选项 (Options)

| 选项名              | 类型             | 默认值 | 描述                                                                 |
| ------------------- | ---------------- | ------ | -------------------------------------------------------------------- |
| `mercatorScale`     | number           | 30     | 墨卡托投影缩放比例                                                   |
| `mercatorTranslate` | [number, number] | [0, 0] | 平移偏移量                                                           |
| `extrudeDepth`      | number           | 1      | 几何体挤出深度                                                       |
| `lineOffset`        | number           | 0.01   | 线条在几何体上方的偏移量                                             |
| `needShapeGeometry` | boolean          | true   | 是否生成填充几何体                                                   |
| `needLineGeometry`  | boolean          | true   | 是否生成线几何体                                                     |
| `refresh`           | boolean          | false  | 变化时刷新，仅适用于 Composition API 和 Vue 组件，且参数必须为响应式 |
| `immediate`         | boolean          | true   | 立即加载，仅适用于 Composition API 和 Vue 组件                       |

## 许可证

MIT
