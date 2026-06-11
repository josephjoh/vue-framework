export type SimplePayMethod =
  | 'KAKAOPAY'
  | 'SSG'
  | 'PAYCO'
  | 'NAVERPAY'
  | 'LPAY'
  | 'SAMSUNGPAY'
  | 'TOSSPAY'
  | 'HANAPAY'
  | 'KBPAY'
  | 'SHINHANSOLPAY'
  | 'BCPAYBOOK'
  | 'HYUNDAI_APPCARD'
  | 'SAMSUNG_APPCARD'
  | 'LOTTE_APPCARD'
  | 'WOORI_APPCARD'

/** STX = 지방세(STAX), ETM = 이택스모바일 */
export type SimplePaySysCode = 'STX' | 'ETM'

export interface SimplePayParams {
  reqAmt: number
  reqCode: string      // 거래번호 13자리
  osDv?: string        // os_dv: 공백/ios/android
  sysCode: SimplePaySysCode
}

export interface SimplePayResult {
  success: boolean
  reqCode: string
  method: SimplePayMethod
  message?: string
}
