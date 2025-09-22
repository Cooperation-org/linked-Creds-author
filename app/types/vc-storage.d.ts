declare module '@cooperation/vc-storage/dist/models/StorageContext' {
  export type StorageKind = 'googleDrive' | 'was' | 'wasZcap'
  export type GoogleDriveOptions = { accessToken: string }
  export type WASOptions = { signer: any; spaceId: string }
  export type WASZcapOptions = { appInstance: any; capability: any }

  export function createStorage(kind: 'googleDrive', options: GoogleDriveOptions): any
  export function createStorage(kind: 'was', options: WASOptions): any
  export function createStorage(kind: 'wasZcap', options: WASZcapOptions): any
}


