import { combineReducers } from 'redux';

import counter from './counter';
import modals from './modals';
import profiles from './profiles';
import tasks from './tasks';

const rootReducer = combineReducers({
    counter,
    modals,
    profiles,
    tasks,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
