import { createSlice } from '@reduxjs/toolkit'

// Load from localStorage
const loadApplications = () => {
  try {
    const saved = localStorage.getItem('jobApplications')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading applications:', error)
  }
  return []
}

// Save to localStorage
const saveApplications = (applications) => {
  try {
    localStorage.setItem('jobApplications', JSON.stringify(applications))
  } catch (error) {
    console.error('Error saving applications:', error)
  }
}

const initialState = {
  applications: loadApplications(),
}

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    addApplication: (state, action) => {
      const newApplication = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      }
      state.applications.push(newApplication)
      saveApplications(state.applications)
    },
    updateApplication: (state, action) => {
      const { id, ...updates } = action.payload
      const index = state.applications.findIndex(app => app.id === id)
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...updates }
        saveApplications(state.applications)
      }
    },
    deleteApplication: (state, action) => {
      state.applications = state.applications.filter(app => app.id !== action.payload)
      saveApplications(state.applications)
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload
      const index = state.applications.findIndex(app => app.id === id)
      if (index !== -1) {
        state.applications[index].status = status
        saveApplications(state.applications)
      }
    },
  },
})

export const { addApplication, updateApplication, deleteApplication, updateStatus } = applicationsSlice.actions
export default applicationsSlice.reducer

