import { combineReducers } from '@reduxjs/toolkit';
import { reducer as accountReducer } from 'src/slices/account';
import { reducer as addressReducer } from 'src/slices/address';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as chatReducer } from 'src/slices/chat';
import { reducer as projectsReducer } from 'src/slices/projects'
import { reducer as formReducer } from 'redux-form';
import { reducer as kanbanReducer } from 'src/slices/kanban';
import { reducer as mailReducer } from 'src/slices/mail';
import { reducer as notificationReducer } from 'src/slices/notification';

const rootReducer = combineReducers({
  account: accountReducer,
  address: addressReducer,
  calendar: calendarReducer,
  chat: chatReducer,
  form: formReducer,
  kanban: kanbanReducer,
  mail: mailReducer,
  notifications: notificationReducer,
  projects: projectsReducer
});

export default rootReducer;
