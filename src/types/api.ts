// 공통 API 응답 타입
export interface ApiRequest<T> {
  REQ_COM: {
    serviceId: string
    screenId: string
    langCd: string
    clientTimeString: string
  }
  REQ_DAT: T
}

export interface ApiResponse<T> {
  RES_COM: {
    tranState: string   // "Y"또는 "N"
    tranMsg: string
    serverTimeString: string
  }
  REQ_DAT?: T
  RES_ERR?: {
    errorCode: string
    errorMsg: string
    errorAddMsg: string
  }
}

export interface ApiError {
  RES_ERR: {
    errorCode: string
    errorMsg: string
    errorAddMsg: string
  }
}