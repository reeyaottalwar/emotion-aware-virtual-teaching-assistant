declare global {
  interface Window {
    feather: {
      replace(): void
    }
    AOS: {
      init(options?: any): void
      refresh(): void
    }
    VANTA: {
      GLOBE(options: any): any
    }
    Chart: any
  }
}

export {}
