import { useSelector, useDispatch } from 'react-redux'
import { updateStatus } from '../store/slices/applicationsSlice'
import ApplicationForm from '../components/ApplicationForm'
import { Briefcase } from 'lucide-react'

const KanbanBoard = () => {
  const applications = useSelector((state) => state.applications.applications)
  const dispatch = useDispatch()

  const columns = [
    { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
    { id: 'interviewing', title: 'Interviewing', color: 'bg-amber-500' },
    { id: 'offer', title: 'Offer', color: 'bg-green-500' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-500' },
  ]

  const handleDragStart = (e, application) => {
    e.dataTransfer.setData('application', JSON.stringify(application))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    const application = JSON.parse(e.dataTransfer.getData('application'))
    if (application.status !== newStatus) {
      dispatch(updateStatus({ id: application.id, status: newStatus }))
    }
  }

  const getApplicationsByStatus = (status) => {
    return applications.filter(app => app.status === status)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Kanban Board</h2>
          <p className="text-slate-600 mt-1">Drag and drop to update status</p>
        </div>
        <ApplicationForm />
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No applications yet</p>
          <ApplicationForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnApplications = getApplicationsByStatus(column.id)
            return (
              <div
                key={column.id}
                className="bg-slate-100 rounded-xl p-4 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`${column.color} text-white px-4 py-2 rounded-lg mb-4 flex items-center justify-between`}>
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-sm">
                    {columnApplications.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnApplications.map((app) => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      className="card cursor-move hover:scale-105 transition-transform"
                    >
                      <h4 className="font-bold text-slate-800 mb-1">{app.company}</h4>
                      <p className="text-sm text-slate-600 mb-2">{app.position}</p>
                      {app.location && (
                        <p className="text-xs text-slate-500 mb-2">📍 {app.location}</p>
                      )}
                      {app.salary && (
                        <p className="text-xs text-slate-500 mb-2">💰 {app.salary}</p>
                      )}
                      {app.notes && (
                        <p className="text-xs text-slate-500 line-clamp-2">{app.notes}</p>
                      )}
                    </div>
                  ))}
                  {columnApplications.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">
                      Drop applications here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default KanbanBoard

