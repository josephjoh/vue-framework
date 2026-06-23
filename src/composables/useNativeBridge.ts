export type BridgeAction =
  | 'BIOMETRIC_AUTH'
  | 'BIOMETRIC_RESULT'
  | 'OPEN_CAMERA'
  | 'CAMERA_RESULT'
  | 'GET_LOCATION'
  | 'LOCATION_RESULT'
  | 'PAY_RESULT'
  | 'OPEN_NATIVE_SCREEN'
  | 'API_CALL'
  | 'API_RESPONSE'

export interface BridgeMessage<T = unknown> {
  action: BridgeAction
  payload?: T
}

type MessageHandler = (payload: unknown) => void

// action별 핸들러를 관리하는 중앙 멀티플렉서
const handlers = new Map<BridgeAction, MessageHandler>()

function initMultiplexer() {
  if (window.onNativeMessage) return
  window.onNativeMessage = (jsonStr: string) => {
    try {
      const { action, payload } = JSON.parse(jsonStr) as BridgeMessage
      handlers.get(action)?.(payload)
    } catch {
      console.error('[NativeBridge] onMessage parse error:', jsonStr)
    }
  }
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
      console.log('[NativeBridge] postMessage (dev):', { action, payload })
    }
  }

  function onMessage<T = unknown>(action: BridgeAction, callback: (payload: T) => void) {
    initMultiplexer()
    handlers.set(action, callback as MessageHandler)
  }

  function removeListener(action: BridgeAction) {
    handlers.delete(action)
  }

  return { postMessage, onMessage, removeListener, isIos, isAndroid }
}
