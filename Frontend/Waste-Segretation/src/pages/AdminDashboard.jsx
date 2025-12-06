import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Truck, AlertTriangle, CheckCircle, XCircle, BarChart2, Clock, Filter, ChevronDown, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [requests, setRequests] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState('analytics');

    useEffect(() => {
        fetchData();
    }, [user, selectedMonth, selectedYear]);

    const fetchData = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [analyticsRes, reqRes, repRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/admin/analytics?month=${selectedMonth}&year=${selectedYear}`, config),
                axios.get('http://localhost:5000/api/requests', config),
                axios.get('http://localhost:5000/api/reports', config),
            ]);
            setAnalytics(analyticsRes.data);
            setRequests(reqRes.data);
            setReports(repRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const updateRequestStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/requests/${id}`, { status }, config);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const updateReportStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5000/api/reports/${id}`, { status }, config);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 pt-24 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <div className="text-sm text-gray-500 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 inline-flex">
                {['analytics', 'requests', 'reports'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === tab
                            ? 'bg-primary-50 text-primary-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {activeTab === 'analytics' && analytics && (
                <div className="space-y-8">
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <Filter size={20} />
                            <span>Filters:</span>
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="input-field py-2 px-4 w-40"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="input-field py-2 px-4 w-32"
                            >
                                {Array.from({ length: 5 }, (_, i) => (
                                    <option key={i} value={new Date().getFullYear() - i}>
                                        {new Date().getFullYear() - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Snapshot Cards */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="card border-l-4 border-l-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Users</h3>
                                <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Users size={20} /></div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{analytics.metrics.totalUsers}</p>
                        </div>
                        <div className="card border-l-4 border-l-green-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Waste Collected</h3>
                                <div className="bg-green-50 p-2 rounded-lg text-green-500"><Truck size={20} /></div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{analytics.metrics.totalWaste} <span className="text-sm text-gray-400 font-normal">kg</span></p>
                        </div>
                        <div className="card border-l-4 border-l-yellow-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending Requests</h3>
                                <div className="bg-yellow-50 p-2 rounded-lg text-yellow-500"><Clock size={20} /></div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{analytics.metrics.pendingRequests}</p>
                        </div>
                        <div className="card border-l-4 border-l-purple-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Resolved Reports</h3>
                                <div className="bg-purple-50 p-2 rounded-lg text-purple-500"><CheckCircle size={20} /></div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{analytics.metrics.resolvedReports}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Pie Chart: Request Status */}
                        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <PieChartIcon size={20} className="text-primary-500" />
                                Request Status Distribution
                            </h3>
                            <div className="h-80 w-full flex-grow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={analytics.charts.pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {analytics.charts.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Bar Chart: Monthly Trend */}
                        <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <BarChart2 size={20} className="text-primary-500" />
                                Monthly Request Trends ({selectedYear})
                            </h3>
                            <div className="h-80 w-full flex-grow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analytics.charts.barData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                        <Tooltip
                                            cursor={{ fill: '#F3F4F6' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="total" name="Total Requests" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
                                        <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.user?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{req.wasteType}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{req.location}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    req.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2">
                                            {req.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => updateRequestStatus(req._id, 'Approved')} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="Approve">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button onClick={() => updateRequestStatus(req._id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Reject">
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'Approved' && (
                                                <button onClick={() => updateRequestStatus(req._id, 'Completed')} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition" title="Complete">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((rep) => (
                                    <tr key={rep._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{rep.user?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{rep.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs" title={rep.description}>{rep.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${rep.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {rep.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {rep.status !== 'Resolved' && (
                                                <button onClick={() => updateReportStatus(rep._id, 'Resolved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition" title="Mark Resolved">
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
