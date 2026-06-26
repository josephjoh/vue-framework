export interface CommCodeItem {
  code: string
  codeName: string
  sortOrder?: number
}

export interface CommCodeRequest {
  groupCd: string
}

export interface CommCodeResponse {
  codeList: CommCodeItem[]
}
