import { ref } from 'vue'
import * as XLSX from 'xlsx'
import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'

export type ExcelRow = Record<string, unknown>

export function useExcelUpload() {
  const rows = ref<ExcelRow[]>([])
  const columns = ref<ColumnDef<ExcelRow>[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const fileName = ref<string | null>(null)

  function buildColumns(headers: string[]): ColumnDef<ExcelRow>[] {
    return headers.map((header) => ({
      accessorKey: header,
      header: () => h('span', header),
      cell: ({ getValue }) => h('span', String(getValue() ?? '')),
    }))
  }

  function parseWorkbook(buffer: ArrayBuffer) {
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const raw = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 })
    if (!raw.length) return

    const headers = (raw[0] as unknown[]).map((h) => String(h ?? ''))
    const dataRows = raw.slice(1).map((row) => {
      const r = row as unknown[]
      return headers.reduce<ExcelRow>((acc, key, i) => {
        acc[key] = r[i] ?? ''
        return acc
      }, {})
    })

    columns.value = buildColumns(headers)
    rows.value = dataRows
  }

  function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls'].includes(ext ?? '')) {
      error.value = '.xlsx 또는 .xls 파일만 업로드할 수 있습니다.'
      return
    }

    error.value = null
    isLoading.value = true
    fileName.value = file.name

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        parseWorkbook(e.target!.result as ArrayBuffer)
      } catch {
        error.value = '파일을 읽는 중 오류가 발생했습니다.'
      } finally {
        isLoading.value = false
        input.value = ''
      }
    }
    reader.onerror = () => {
      error.value = '파일 읽기에 실패했습니다.'
      isLoading.value = false
    }
    reader.readAsArrayBuffer(file)
  }

  function reset() {
    rows.value = []
    columns.value = []
    error.value = null
    fileName.value = null
  }

  return { rows, columns, isLoading, error, fileName, handleFileChange, reset }
}
