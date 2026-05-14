<template>
  <div class="space-y-4">
    <!-- 업로드 영역 -->
    <div class="flex items-center gap-3">
      <label
        class="cursor-pointer inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {{ props.uploadLabel }}
        <input type="file" accept=".xlsx,.xls" class="hidden" @change="onFileChange" />
      </label>

      <span v-if="fileName" class="text-sm text-muted-foreground">{{ fileName }}</span>

      <button
        v-if="rows.length"
        class="text-sm text-destructive hover:underline ml-auto"
        @click="onReset"
      >
        초기화
      </button>
    </div>

    <!-- 에러 -->
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>

    <!-- 로딩 -->
    <div v-if="isLoading" class="text-sm text-muted-foreground">파일을 읽는 중...</div>

    <!-- 빈 상태 -->
    <div
      v-else-if="!rows.length && !error"
      class="flex items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground"
      :style="{ height: props.emptyHeight }"
    >
      {{ props.emptyText }}
    </div>

    <!-- 그리드 -->
    <template v-else-if="rows.length">
      <p v-if="props.showSummary" class="text-sm text-muted-foreground">총 {{ rows.length }}행 · {{ columns.length }}열</p>
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="bg-muted font-semibold"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-muted/50">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useVueTable, getCoreRowModel, FlexRender } from '@tanstack/vue-table'
import { useExcelUpload, type ExcelRow } from '@/composables/useExcelUpload'
import Table from '@/components/ui/table/Table.vue'
import TableHeader from '@/components/ui/table/TableHeader.vue'
import TableBody from '@/components/ui/table/TableBody.vue'
import TableRow from '@/components/ui/table/TableRow.vue'
import TableHead from '@/components/ui/table/TableHead.vue'
import TableCell from '@/components/ui/table/TableCell.vue'

const props = withDefaults(defineProps<{
  uploadLabel?: string
  emptyText?: string
  emptyHeight?: string
  showSummary?: boolean
}>(), {
  uploadLabel: 'Excel 파일 선택',
  emptyText: '엑셀 파일을 업로드하면 여기에 데이터가 표시됩니다.',
  emptyHeight: '10rem',
  showSummary: true,
})

const emit = defineEmits<{
  change: [rows: ExcelRow[]]
}>()

const { rows, columns, isLoading, error, fileName, handleFileChange, reset } = useExcelUpload()

const table = useVueTable({
  get data() { return rows.value },
  get columns() { return columns.value },
  getCoreRowModel: getCoreRowModel(),
})

watch(rows, (newRows) => emit('change', newRows))

function onFileChange(event: Event) {
  handleFileChange(event)
}

function onReset() {
  reset()
}

defineExpose({ rows, columns, reset })
</script>
