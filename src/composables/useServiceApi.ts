import { post } from '@/api/request'
import { useNativeBridge } from '@/composables/useNativeBridge'
import router from '@/router'
import type { ApiRequest, ApiResponse } from '@/types'
import type { AxiosRequestConfig } from 'axios'

interface NativeApiResponse<TRes> {
  requestId: string
  data?: ApiResponse<TRes>
  error?: string
}

// 응답 대기 중인 요청 map (requestId → Promise resolver)
const pendingRequests = new Map<string, {
  resolve: (data: ApiResponse<unknown>) => void
  reject: (err: Error) => void
}>()

export const useServiceApi = () => {
  const { postMessage, onMessage, isIos, isAndroid } = useNativeBridge()

  const isNative = () => isIos() || isAndroid()

  // API_RESPONSE 핸들러 1회 등록
  onMessage<NativeApiResponse<unknown>>('API_RESPONSE', (payload) => {
    const pending = pendingRequests.get(payload.requestId)
    if (!pending) return
    if (payload.error) {
      pending.reject(new Error(payload.error))
    } else {
      pending.resolve(payload.data!)
    }
    pendingRequests.delete(payload.requestId)
  })

  const callPostApi = async <TReq, TRes>(
    serviceId: string,
    payload: TReq,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TRes>> => {
    const screenId = router.currentRoute.value.path.split('/').pop() || 'index'
    const postData: ApiRequest<TReq> = {
      REQ_COM: {
        serviceId,
        screenId,
        langCd: 'KO',
        clientTimeString: new Date().toLocaleDateString(),
      },
      REQ_DAT: payload,
    }

    if (isNative()) {
      return new Promise<ApiResponse<TRes>>((resolve, reject) => {
        const requestId = `${serviceId}_${Date.now()}`
        pendingRequests.set(requestId, {
          resolve: resolve as (data: ApiResponse<unknown>) => void,
          reject,
        })
        postMessage('API_CALL', { requestId, ...postData })
      })
    }

    return post<ApiResponse<TRes>>(`/service/${serviceId}`, postData, config)
  }

  return { callPostApi }
}
