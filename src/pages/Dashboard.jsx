import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { TrendingUp, Briefcase, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import ApplicationForm from '../components/ApplicationForm'

const Dashboard = () => {
  const applications = useSelector((state) => state.applications.applications)

  const stats = {
    total: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interviewing: applications.filter(app => app.status === 'interviewing').length,
    offer: applications.filter(app => app.status === 'offer').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  }

  const statusData = [
    { name: 'Applied', value: stats.applied, color: '#3b82f6' },
    { name: 'Interviewing', value: stats.interviewing, color: '#f59e0b' },
    { name: 'Offer', value: stats.offer, color: '#10b981' },
    { name: 'Rejected', value: stats.rejected, color: '#ef4444' },
  ]

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700',
      interviewing: 'bg-amber-100 text-amber-700',
      offer: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-slate-100 text-slate-700'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-600 mt-1">Track your job application journey</p>
        </div>
        <ApplicationForm />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Briefcase className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Applied</p>
              <p className="text-3xl font-bold mt-1">{stats.applied}</p>
            </div>
            <TrendingUp className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Interviewing</p>
              <p className="text-3xl font-bold mt-1">{stats.interviewing}</p>
            </div>
            <Clock className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Offers</p>
              <p className="text-3xl font-bold mt-1">{stats.offer}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 opacity-80" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold mt-1">{stats.rejected}</p>
            </div>
            <XCircle className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry, index) => {
                  const percentage = statusData[index].value && stats.total
                    ? `${Math.round((statusData[index].value / stats.total) * 100)}%`
                    : '0%'
                  return `${value} · ${percentage}`
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Applications by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-800">Recent Applications</h3>
          <Link to="/applications" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        {recentApplications.length > 0 ? (
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{app.company}</h4>
                  <p className="text-slate-600 text-sm">{app.position}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Applied on {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No applications yet</p>
            <ApplicationForm />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

