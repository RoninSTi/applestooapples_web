import { createSlice } from '@reduxjs/toolkit';
import api from 'src/utils/api';

const initialState = {
  isLoading: false,
  projects: [],
  projectDetail: null
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearDetail(state) {
      state.projectDetail = null
    },
    getProject(state, action) {
      const { project } = action.payload;

      state.projectDetail = project;
    },
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
    setLoading(state, action) {
      const { isLoading } = action.payload;

      state.isLoading = isLoading;
    },
    updateProject(state, action) {
      const { project } = action.payload;

      state.projectDetail = project;

      const filteredProjects = state.projects.filter(({ id }) => id !== project.id);

      state.projects = [
        ...filteredProjects,
        project
      ];
    }
  }
});

export const reducer = slice.reducer;

export const clearDetail = () => async (dispatch) => {
  dispatch(slice.actions.clearDetail())
}

export const createProjectDocument = ({ projectId, ...data }) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: `project/${projectId}/document`,
    data
  });

  const project = response.data

  dispatch(slice.actions.updateProject({ project }))
}

export const deleteProjectDocument = ({ documentId, projectId }) => async (dispatch) => {
  const response = await api({
    method: 'delete',
    url: `project/${projectId}/document/${documentId}`,
  });

  const project = response.data

  dispatch(slice.actions.updateProject({ project }))
}

export const getProject = ({ projectId }) => async (dispatch) => {
  dispatch(slice.actions.setLoading({ isLoading: true }));

  try {
    const response = await api({
      method: 'get',
      url: `project/${projectId}`
    });

    const project = response.data

    dispatch(slice.actions.getProject({ project }))
  } catch (err) {
    console.log(err)
  } finally {
    dispatch(slice.actions.setLoading({ isLoading: false }));
  }
}

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
  await api({
    method: 'delete',
    url: `project/${projectId}`
  })

  dispatch(slice.actions.deleteProject({ projectId }))
}

export const editProjectAddress = ({ addressId, data, projectId }) => async dispatch => {
  const response = await api({
    method: 'put',
    url: `project/${projectId}/address/${addressId}`,
    data
  })

  dispatch(slice.actions.updateProject({ project: response.data }))
}

export const resendProjectInvite = ({ collaboratorId, projectId }) => async (dispatch) => {
  const response = await api({
    method: 'post',
    url: `/project/${projectId}/resend`,
    data: {
      collaboratorId,
    }
  });

  dispatch(slice.actions.updateProject({ project: response.data }))
}

export const updateProject = ({ projectId, data }) => async (dispatch) => {
  const response = await api({
    method: 'put',
    url: `project/${projectId}`,
    data
  })

  dispatch(slice.actions.updateProject({ project: response.data }))
}

export default slice;
