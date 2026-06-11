import type { SimplePayMethod, SimplePayParams } from '@/types/SimplePay'
// import { post } from '@/api/request' // TODO: 실제 백엔드 연동 시 주석 해제

export type { SimplePayMethod, SimplePayParams }

const SEOUL_BASE = 'https://tetax2.seoul.go.kr'

// TODO: 실제 연동 시 post() 호출로 교체, 아래 mock 맵 제거
const MOCK_URLS: Record<SimplePayMethod, string> = {
  KAKAOPAY:        'https://online-payment.kakaopay.com/mockup/bridge/mobile-web/pg/one-time/payment/d2c8fe44e7146d16bb40a22a90592b209db7fb90638110d0548709b36d9cb0dd',
  NAVERPAY:        'https://nid.naver.com/nidlogin.login?url=https%3A%2F%2Ftest-m.pay.naver.com%2Fz%2Fpayments%2F20260604d3ZxSmdLMk1qZ1hyaFZsK3V6cTNHakJNQW9ZPQ%3D%3D&svctype=262144',
  PAYCO:           'https://demo-id.payco.com/login.nhn?serviceProviderCode=PAY&inflowKey=SEOUL&nextURL=https%3A%2F%2Falpha-bill.payco.com%2Fm%2FeasyLogin%2F202606042007166122',
  SSG:             'https://www.ssgpay.com/ssgpayweb/mobile/order/specialMobilePay',
  LPAY:            'https://www.lpay.com/dlp/pg/bridge',
  SAMSUNGPAY:      'https://kr.mpay.samsung.com/onlinepay/pc_mpi/payRequestSms.do',
  TOSSPAY:         'https://alpha-pay.toss.im/payfront/auth?payToken=OklOS1pd7VVSrqNX1EJK62',
  HANAPAY:         'https://acs.hanacard.co.kr/payapp/C000000000VPQC.web',
  KBPAY:           'https://web.nicepay.co.kr/v3/smart/auth/card/kmotion/verify_kmotion.jsp',
  SHINHANSOLPAY:   'https://web.nicepay.co.kr/v3/smart/auth/card/polaris/verify_polaris.jsp',
  BCPAYBOOK:       'https://ui.vpay.co.kr/mobile/payment/bcAppPay',
  HYUNDAI_APPCARD: 'https://web.nicepay.co.kr/v3/smart/auth/card/polaris/verify_polaris.jsp',
  SAMSUNG_APPCARD: 'https://web.nicepay.co.kr/v3/smart/auth/card/polaris/verify_polaris.jsp',
  LOTTE_APPCARD:   'https://web.nicepay.co.kr/v3/smart/auth/card/rocomo/verify_rocomo.jsp',
  WOORI_APPCARD:   'https://dacs.wooricard.com:8886/wcrpay/COM300001A.wcdo;jsessionid=ciMhfSqVIAgr1WPi9kGkBg3CHGuMgqfAJaZ5hr3SFMCu3GA1T12fT0a1qCPW9NN5.amV1c19kb21haW4vd2NycGF5MjE=?memKey=D056211E29708C248F2876A9C3D378CB5914B4D8D67B091650A4B92FA2D13E0CE760CFA6C2FCAAFA21977D5ABF8696F70CBC4BD5788145279BA6EC3F659D3DE8D3052E1F9DE955EA6E68ED27DA98FC55991B293B25E603C541F880C92C900021873A73A372D84F055DCF31787AF6A9529BCA0555BEE437F2227DB31C75E35E3C804EBF8A2CA839749D7120B4B3B247972AB904F5A21B0C32204D996DD37990C0CE384D2412F6BAE62883C05FAF3340362DC94F26A4ECBAD5FF730EF924FDE235',
}

/** 결제 URL 호출 */
function openPayUrl(url: string): void {
  window.open(url, '_blank')
}


export function useSimplePay() {
  async function pay(method: SimplePayMethod, _params: SimplePayParams): Promise<void> {
      // TODO: 실제 백엔드 연동 시 아래 주석 해제 후 mock 블록 제거
  // const { redirectUrl } = await post<{ redirectUrl: string }>(`${BACKEND_API.base}${apiPath}`, {
  //   reqAmt:  _params.reqAmt,
  //   reqCode: _params.reqCode,
  //   osDv:    _params.osDv ?? '',
  //   sysCode: _params.sysCode,
  // })
  // return redirectUrl
    const redirectUrl = MOCK_URLS[method]
    openPayUrl(redirectUrl)
  }

  return { pay }
}
