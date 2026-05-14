<template>
  <div>
    <h2>Sample Components</h2>
    <button v-on:click="callApiForList" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SampleInfoReq, SampleInfoRes, SampleItems } from '@/types'
import { useServiceApi } from '@/composables/useServiceApi';

const sampleInfo = ref<SampleItems[]>([])
const { callPostApi } = useServiceApi()

const callApiForList = () => {
  getList()
}

const getList = async () => {
  const serviceId = 'BIZ0010S02'
  // const screenId = 'PAY0101M01'
  const payload: SampleInfoReq = {
    bizId: 'TESTID00'
  }

  const result = await callPostApi<SampleInfoReq, SampleInfoRes>(
    serviceId,
    payload,
  )

  console.log('result.RES_DAT >>> ', result.REQ_DAT?.data)
  sampleInfo.value = result.REQ_DAT?.data ?? []
  console.log('sampleInfo >> ', sampleInfo.value)
}
</script>