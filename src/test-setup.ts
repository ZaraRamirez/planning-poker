class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(window as any).ResizeObserver = MockResizeObserver;