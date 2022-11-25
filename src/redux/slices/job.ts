import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
import { Job, JobState } from '../../@types/job';
//
import { dispatch } from '../store';
const BASE_URL = 'https://63553cf1da523ceadcfd4ca1.mockapi.io';

// ----------------------------------------------------------------------

const initialState: JobState = {
  isLoading: false,
  error: null,
  jobs: [],
  job: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
};

const slice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET JOBS
    getJobsSuccess(state, action) {
      state.isLoading = false;
      state.jobs = action.payload;
    },

    // GET JOB
    getJobSuccess(state, action) {
      state.isLoading = false;
      state.job = action.payload;
    },

    //  SORT & FILTER JOBS
    sortByJobs(state, action) {
      state.sortBy = action.payload;
    },

    filterJobs(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { sortByJobs, filterJobs } = slice.actions;

// ----------------------------------------------------------------------

export function getJobs() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      axios.defaults.baseURL = BASE_URL;
      const response: { data: { jobs: Job[] } } = await axios.get('/api/v1/schedule_jobs');
      dispatch(slice.actions.getJobsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export async function createJob(data: object) {
  dispatch(slice.actions.startLoading());
  try {
    axios.defaults.baseURL = BASE_URL;
    const response = await axios.post('/api/v1/schedule_jobs', {
      data: JSON.stringify(data),
    });
    dispatch(slice.actions.getJobSuccess(response.data));
    return response.data;
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.hasError(error));
  }
}

export async function deleteJob(id: any) {
  dispatch(slice.actions.startLoading());
  try {
    axios.defaults.baseURL = BASE_URL;
    await axios.delete(`/api/v1/schedule_jobs/${id}`);
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.hasError(error));
  }
}

export async function updateJob(data: object, id: any) {
  console.log('Before:::', data,id);
  dispatch(slice.actions.startLoading());
  try {
    axios.defaults.baseURL = BASE_URL;
    const res = await axios.put(`/api/v1/schedule_jobs/${id}`, {
      data: JSON.stringify(data),
    });
    console.log('RES:::', res.data);
  } catch (error) {
    console.log(error);
    dispatch(slice.actions.hasError(error));
  }
}

// ----------------------------------------------------------------------

export function getJob(name: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response: { data: { job: Job } } = await axios.get('/api/jobs/job', {
        params: { name },
      });
      dispatch(slice.actions.getJobSuccess(response.data.job));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
