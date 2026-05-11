export interface SampleInfoReq {
  bizId: string
}

// export interface SampleInfoRes {
//   systemCode: string
//   bizId: string
//   bizAddress: string
//   bizNumber: string
//   regDttm: string
//   regUser: string
//   updDttm: string
//   updUser: string
// }

export interface SampleItems {
  systemCode: string
  bizId: string
  bizAddress: string
  bizNumber: string
  regDttm: string
  regUser: string
  updDttm: string
  updUser: string
}
export interface SampleInfoRes {
  data: SampleItems[]
}
