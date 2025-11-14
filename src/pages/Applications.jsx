import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import { Trash2, Edit, ExternalLink, MapPin, DollarSign, Search, Filter } from 'lucide-react'
import { deleteApplication, updateApplication } from '../store/slices/applicationsSlice'
import ApplicationForm from '../components/ApplicationForm'
import { useState } from 'react'

const Applications = () => {
  const applications = useSelector((state) => state.applications.applications)
  const dispatch = useDispatch()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      dispatch(deleteApplication(id))
    }
  }

  const handleEdit = (app) => {
    setEditingId(app.id)
    setEditForm(app)
  }

  const handleSaveEdit = () => {
    dispatch(updateApplication(editForm))
    setEditingId(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700 border-blue-300',
      interviewing: 'bg-amber-100 text-amber-700 border-amber-300',
      offer: 'bg-green-100 text-green-700 border-green-300',
      rejected: 'bg-red-100 text-red-700 border-red-300',
    }
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-300'
  }

  const filteredAndSortedApplications = [...applications]
    .filter((app) => {
      const matchesSearch = 
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">All Applications</h2>
          <p className="text-slate-600 mt-1">Manage your job applications</p>
        </div>
        <ApplicationForm />
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, position, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        {(searchQuery || statusFilter !== 'all') && (
          <div className="mt-3 text-sm text-slate-600">
            Showing {filteredAndSortedApplications.length} of {applications.length} applications
          </div>
        )}
      </div>

      {filteredAndSortedApplications.length === 0 ? (
        <div className="card text-center py-12">
          {applications.length === 0 ? (
            <>
              <p className="text-slate-500 mb-4">No applications yet</p>
              <ApplicationForm />
            </>
          ) : (
            <>
              <p className="text-slate-500 mb-2">No applications match your search criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredAndSortedApplications.map((app) => (
            <div key={app.id} className="card">
              {editingId === app.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={editForm.company || ''}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={editForm.position || ''}
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editForm.status || 'applied'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button onClick={handleCancelEdit} className="btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleSaveEdit} className="btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-800">{app.company}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-lg text-slate-700 mb-3">{app.position}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                      {app.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{app.location}</span>
                        </div>
                      )}
                      {app.salary && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{app.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <span>Applied: {format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                    {app.notes && (
                      <p className="text-slate-600 text-sm mb-3 bg-slate-50 p-3 rounded-lg">
                        {app.notes}
                      </p>
                    )}
                    {app.applicationUrl && (
                      <a
                        href={app.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Application</span>
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(app)}
                      className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Applications

