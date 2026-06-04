export type BridgeAction =
  | 'BIOMETRIC_AUTH'
  | 'BIOMETRIC_RESULT'
  | 'OPEN_CAMERA'
  | 'CAMERA_RESULT'
  | 'GET_LOCATION'
  | 'LOCATION_RESULT'
  | 'PAY_RESULT'

export interface BridgeMessage<T = unknown> {
  action: BridgeAction
  payload?: T
}

export function useNativeBridge() {
  const isIos = () => !!(window as Window).webkit?.messageHandlers?.bridge
  const isAndroid = () => !!(window as Window).AndroidBridge

  function postMessage<T = unknown>(action: BridgeAction, payload?: T) {
    const data = JSON.stringify({ action, payload })

    if (isIos()) {
      window.webkit!.messageHandlers.bridge.postMessage(data)
    } else if (isAndroid()) {
      window.AndroidBridge!.postMessage(data)
    } else {
      // 브라우저 개발 환경 — 메시지만 출력
      console.log('[NativeBridge] postMessage (dev):', { action, payload })
    }
  }

  function onMessage<T = unknown>(callback: (action: BridgeAction, payload: T) => void) {
    window.onNativeMessage = (jsonStr: string) => {
      try {
        const { action, payload } = JSON.parse(jsonStr) as BridgeMessage<T>
        callback(action, payload as T)
      } catch {
        console.error('[NativeBridge] onMessage parse error:', jsonStr)
      }
    }
  }

  function removeListener() {
    delete window.onNativeMessage
  }

  return { postMessage, onMessage, removeListener, isIos, isAndroid }
}
