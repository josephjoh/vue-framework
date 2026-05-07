import http from '@/api'
import type { AxiosRequestConfig } from 'axios'

export async function get<T, P extends object = object>(url: string, params?: P): Promise<T> {
  const res = await http.get<T>(url, { params })
  return res.data
}

export async function post<T, B extends object = object>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await http.post<T>(url, body, config)
  console.log('request post >>> ', res)
  return res.data
}

export async function put<T, B extends object = object>(url: string, body: B): Promise<T> {
  const res = await http.put<T>(url, body)
  return res.data
}

export async function del<T = void>(url: string): Promise<T> {
  const res = await http.delete<T>(url)
  return res.data
}
