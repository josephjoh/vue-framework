export interface InternetGiroRequest {
  reqCode: string   // 납부번호
  sysCode: string   // 시스템코드 (예: ETAX, STAX)
  sc: string        // 서비스코드
  gc: string        // 기관코드
}

export interface InternetGiroParams {
  sc: string            // 서비스코드
  gc: string            // 기관코드
  tc: string            // 전자납부번호
  rc: string            // 참조코드
  req_semokCd?: string  // 세목코드 (선택)
  req_semokNm?: string  // 세목명 (선택)
}
