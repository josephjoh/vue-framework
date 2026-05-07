import { useRoute } from 'vue-router'
import { post } from '@/api/request'
import type { ApiRequest, ApiResponse } from '@/types'
import type { AxiosRequestConfig } from 'axios'

export const useServiceApi = () => {
  const route = useRoute()

  const callPostApi = async <TReq, TRes>(
    serviceId: string,
    payload: TReq,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TRes>> => {
    const screenId = route.path.split('/').pop() || 'index'
    const postData: ApiRequest<TReq> = {
      REQ_COM: {
        serviceId,
        screenId,
        langCd: 'KO',
        clientTimeString: new Date().toLocaleDateString(),
      },
      REQ_DAT: payload,
    }
    return post<ApiResponse<TRes>>(`/service/${serviceId}`, postData, config)
  }

  return { callPostApi }
}
