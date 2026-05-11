const _state = reactive({
  show: false,
  title: '',
  detail: '',
  resolve: null as ((v: boolean) => void) | null,
})

export const useAdminConfirm = () => {
  const confirm = (title: string, detail = ''): Promise<boolean> => {
    _state.title = title
    _state.detail = detail
    _state.show = true
    return new Promise(resolve => { _state.resolve = resolve })
  }

  const accept = () => { _state.show = false; _state.resolve?.(true) }
  const cancel = () => { _state.show = false; _state.resolve?.(false) }

  return { state: _state, confirm, accept, cancel }
}
