import storage from 'redux-persist/lib/storage';
import { PersistConfig } from 'redux-persist/es/types';
import { RootState } from 'store';

const persistConfig: PersistConfig<RootState> = {
  key: 'aystore',
  storage: storage as any,
};

export default persistConfig;
