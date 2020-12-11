import { createSlice } from '@reduxjs/toolkit';
import api from 'src/utils/api';

const initialState = {
  projects: [],
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    getProjects(state, action) {
      const { projects } = action.payload;

      state.projects = projects;
    },
    copyProject(state, action) {
      const { project } = action.payload;

      state.projects = [
        ...state.projects,
        project
      ];
    },
    createProject(state, action) {
      const { project } = action.payload;

      state.projects = [
        ...state.projects,
          project
      ];
    },
    deleteProject(state, action) {
      const { projectId } = action.payload;

      state.projects = state.projects.filter(({ id }) => id !== projectId)
    },
    updateProject(state, action) {
      const { projects } = action.payload

      state.projects = projects
    }
  }
});

export const reducer = slice.reducer;

export const getProjects = () => async (dispatch) => {
  const response = await api.get(`/projects`);

  dispatch(slice.actions.getProjects({ projects: response.data }));
};

export const copyProject = ({ projectId }) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: `project/copy/${projectId}`,
  });

  const project = response.data

  dispatch(slice.actions.copyProject({ project }))
}

export const createProject = ({ data, history }) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: `project`,
    data,
  });

  const project = response.data

  dispatch(slice.actions.createProject({ project }));

  history.push(`/app/management/projects/${project.id}`)
};

export const deleteProject = ({ projectId }) => async dispatch => {
  const response = await api({
    method: 'delete',
    url: `project/${projectId}`
  })

  dispatch(slice.actions.deleteProject({ projectId }))
}

export const updateProject = ({ projectId, data }) => async (dispatch) => {
  const response = await api({
    method: 'put',
    url: `project/${projectId}`,
    data
  })

  dispatch(slice.actions.updateProject({ projects: response.data }))
}

export default slice;