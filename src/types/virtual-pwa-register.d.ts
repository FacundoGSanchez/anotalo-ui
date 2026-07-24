declare module "virtual:pwa-register/react" {
  export function useRegisterSW(): {
    needRefresh: [boolean, (value: boolean) => void];
    updateServiceWorker: (reload?: boolean) => Promise<void>;
    offlineReady: [boolean, (value: boolean) => void];
  };
}
