export interface CommonCodeItem {
  code: string
  codeName: string
  sortOrder?: number
}

export interface CommonCodeRequest {
  groupCd: string
}

export interface CommonCodeResponse {
  codeList: CommonCodeItem[]
}
