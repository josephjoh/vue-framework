<template>
  <div class="p-6 space-y-4">
    <h2 class="text-xl font-semibold">Excel 업로드 Grid</h2>

    <ExcelGrid
      v-bind="excelGridProps"
      @change="onDataChange"
    />

    <pre v-if="parsedRows.length" class="text-xs text-muted-foreground bg-muted rounded p-3 max-h-40 overflow-auto">
      {{ JSON.stringify(parsedRows.slice(0, 3), null, 2) }} …
    </pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ExcelGrid }from '@/components/ui/excel-grid'
import type { ExcelRow } from '@/composables/useExcelUpload'

const excelGridProps = {
  uploadLabel: 'EXcel 테스트',
  emptyText: 'excelGridProps 파일을 선택해주세요.',
  showSummary: true,
}

const parsedRows = ref<ExcelRow[]>([])

function onDataChange(rows: ExcelRow[]) {
  console.log('rows >>> ', rows)
  parsedRows.value = rows
}
</script>
