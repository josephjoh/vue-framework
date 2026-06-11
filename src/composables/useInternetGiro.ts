import type { InternetGiroRequest, InternetGiroParams } from '@/types/InternetGiro'
// import { post } from '@/api/request' // TODO: 실제 백엔드 연동 시 주석 해제

// ─── 설정 ────────────────────────────────────────────────────────────────────

const GIRO_BASE = 'https://giro.or.kr'

// const BACKEND_API = {
//   giro: '/api/giro/params', // TODO: 실제 백엔드 경로로 교체
// }

// ─── 구현 ────────────────────────────────────────────────────────────────────

/** 서버에서 인터넷지로 납부 파라미터를 받아옴 */
async function fetchGiroParams(request: InternetGiroRequest): Promise<InternetGiroParams> {
  // TODO: 실제 백엔드 연동 시 아래 주석 해제 후 mock 블록 제거
  // const data = await post<InternetGiroParams>(BACKEND_API.giro, {
  //   reqCode: request.reqCode,
  //   sysCode: request.sysCode,
  //   sc:      request.sc,
  //   gc:      request.gc,
  // })
  // return data

  // mock: 백엔드에서 받은 InternetGiroParams 가정 (실제 연동 시 위 주석 해제 후 이 블록 제거)
  return {
    sc:          request.sc,
    gc:          request.gc,
    tc:          '20260602102714SE1008812606027544090000005928160EO',
    rc:          'SSO75440912606022606024ETAX98765',
    req_semokCd: '',
    req_semokNm: '',
  }
}

/** 인터넷지로 납부 URL 생성 */
function buildGiroUrl(params: InternetGiroParams): string {
  const query = new URLSearchParams({
    sc:          params.sc,
    gc:          params.gc,
    tc:          params.tc,
    rc:          params.rc,
    req_semokCd: params.req_semokCd ?? '',
    req_semokNm: params.req_semokNm ?? '',
  })
  return `${GIRO_BASE}/epay/index.jsp?${query.toString()}`
}

/** 납부 팝업 오픈 */
function openGiroPopup(url: string): void {
  window.open(url, 'giroPayPopup', 'width=850,height=700,scrollbars=yes')
}

// ─── 공개 composable ──────────────────────────────────────────────────────────

export function useInternetGiro() {
  async function pay(request: InternetGiroRequest): Promise<{ params: InternetGiroParams; url: string }> {
    const params = await fetchGiroParams(request)
    const url = buildGiroUrl(params)
    openGiroPopup(url)
    return { params, url }
  }

  return { pay }
}
