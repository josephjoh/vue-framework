interface Window {
  webkit?: {
    messageHandlers: {
      bridge: { postMessage: (data: string) => void }
    }
  }
  AndroidBridge?: {
    postMessage: (data: string) => void
  }
  onNativeMessage?: (jsonStr: string) => void
}
