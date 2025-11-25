<template>
  <TresGroup v-if="mergedShapeGeometry || mergedLineGeometry">
    <!-- 合并的填充几何体 -->
    <TresMesh v-if="mergedShapeGeometry" :geometry="mergedShapeGeometry">
      <slot name="shape">
        <TresMeshBasicMaterial color="#409EFF" />
      </slot>
    </TresMesh>
    <!-- 合并的线段几何体 -->
    <TresLineSegments v-if="mergedLineGeometry" :geometry="mergedLineGeometry">
      <slot name="line">
        <TresLineBasicMaterial color="#000000" />
      </slot>
    </TresLineSegments>
    <slot></slot>
  </TresGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGeojson } from '../hooks/useGeojson'
import { BufferGeometry } from 'three'
import { Options } from '@/types/options'

// 导出组件接口
export interface GeoJsonProps {
  url: string
  mercatorCenter: [number, number]
  options?: Partial<
    Options & {
      refresh: boolean
      immediate: boolean
    }
  >
}

export interface GeoJsonEmits {
  (e: 'geojson-error', error: unknown): void
  (
    e: 'geojson-result',
    result: {
      mergedShapeGeometry: BufferGeometry | undefined
      mergedLineGeometry: BufferGeometry | undefined
    }
  ): void
}

const props = withDefaults(defineProps<GeoJsonProps>(), {
  options: () => {
    return {
      mercatorScale: 30,
      mercatorTranslate: [0, 0],
      extrudeDepth: 1,
      lineOffset: 0.01,
      needShapeGeometry: true,
      needLineGeometry: true,
      refresh: false,
      immediate: true,
    }
  },
})

const emit = defineEmits<GeoJsonEmits>()

const url = computed(() => props.url)
const mercatorCenter = computed(() => props.mercatorCenter)
const options = computed(() => props.options)

const {
  mergedShapeGeometry,
  mergedLineGeometry,
  onResult,
  onError,
  isGeneration,
  execute,
  dispose,
} = useGeojson(url, mercatorCenter, options)
onResult((result) => {
  emit('geojson-result', result)
})
onError((error) => {
  emit('geojson-error', error)
})
defineExpose({
  isGeneration,
  execute,
  dispose,
})
</script>

<style scoped></style>
