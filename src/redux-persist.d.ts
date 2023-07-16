declare module 'redux-persist/es/types' {
  // Define the necessary types here
  // For example:
  export interface PersistConfig<S> {
    key: string;
    storage: any;
  }
}

declare module 'redux-persist/lib/storage' {
  const storage: any;
  export default storage;
}
