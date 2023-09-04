export const waitTimer = (callback: () => void, delay = 5000) => {
  const timer = setTimeout(() => {
    callback()
  }, delay)

  return () => clearTimeout(timer)
}
