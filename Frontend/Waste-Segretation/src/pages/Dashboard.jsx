import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, Trash2, AlertTriangle, Award, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState([]);
    const [reports, setReports] = useState([]);
    const [centers, setCenters] = useState([]);
    const [modules, setModules] = useState([]);
    const [points, setPoints] = useState(0);
    const [completedModules, setCompletedModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form States
    const [requestForm, setRequestForm] = useState({ wasteType: 'Plastic', quantity: '', location: '' });
    const [reportForm, setReportForm] = useState({ location: '', description: '', imageUrl: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setPoints(user.points);
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            try {
                const [reqRes, repRes, centerRes, modRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/requests', config),
                    axios.get('http://localhost:5000/api/reports', config),
                    axios.get('http://localhost:5000/api/centers'),
                    axios.get('http://localhost:5000/api/modules', config),
                ]);
                setRequests(reqRes.data);
                setReports(repRes.data);
                setCenters(centerRes.data);
                setModules(modRes.data);
            } catch (err) {
                console.error("Error fetching main data:", err);
            }

            try {
                const profileRes = await axios.get('http://localhost:5000/api/auth/profile', config);
                setPoints(profileRes.data.points);
                setCompletedModules(profileRes.data.completedModules || []);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            await axios.post('http://localhost:5000/api/requests', requestForm, config);
            setMessage('Request submitted successfully!');
            setRequestForm({ wasteType: 'Plastic', quantity: '', location: '' });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error submitting request');
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/reports', reportForm, config);
            setMessage('Report submitted successfully!');
            setReportForm({ location: '', description: '', imageUrl: '' });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error submitting report');
        }
    };

    const handleDeleteRequest = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/requests/${id}`, config);
                setMessage('Request deleted successfully');
                setRequests(requests.filter(req => req._id !== id));
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Error deleting request');
            }
        }
    };

    const handleGetLocation = (formType) => {
        if (!navigator.geolocation) {
            setMessage('Geolocation is not supported by your browser');
            return;
        }

        setMessage('Fetching location...');
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const locationString = `${latitude}, ${longitude}`;

            if (formType === 'request') {
                setRequestForm(prev => ({ ...prev, location: locationString }));
            } else if (formType === 'report') {
                setReportForm(prev => ({ ...prev, location: locationString }));
            }

            setMessage('Location fetched successfully');
            setTimeout(() => setMessage(''), 3000);
        }, () => {
            setMessage('Unable to retrieve your location');
            setTimeout(() => setMessage(''), 3000);
        });
    };

    const handleModuleComplete = async (moduleId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`http://localhost:5000/api/modules/${moduleId}/complete`, {}, config);
            setMessage(`Module completed! You earned 100 points.`);
            // Update local user points and completed status
            fetchData();
            setSelectedModule(null); // Close modal if open (though logic handles this in render)
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error completing module');
        }
    };

    return (
        <div className="space-y-8 pt-24 pb-12">
            {/* Header & Stats */}
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                    <p className="text-gray-500 mt-1">Manage your waste disposal and track your environmental impact.</p>
                </div>
                <div className="bg-gradient-to-r from-primary-50 to-white px-8 py-4 rounded-xl flex items-center gap-4 border border-primary-100 shadow-sm">
                    <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                        <Award size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Your Rewards</p>
                        <p className="text-3xl font-bold text-primary-700">{points} <span className="text-sm font-normal text-gray-500">Points</span></p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
                {['requests', 'reports', 'centers', 'modules'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-8 py-4 font-medium text-sm transition-all relative ${activeTab === tab
                            ? 'text-primary-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'requests' && 'Pickup Requests'}
                        {tab === 'reports' && 'Illegal Dumping'}
                        {tab === 'centers' && 'Recycling Centers'}
                        {tab === 'modules' && 'Awareness Modules'}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {message && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-2 animate-fade-in">
                    <CheckCircle size={20} /> {message}
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="grid lg:grid-cols-[45%_55%] gap-8">
                    {/* Request Form */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-28">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                <div className="bg-primary-100 p-2 rounded-lg text-primary-600"><Plus size={20} /></div>
                                New Request
                            </h3>
                            <form onSubmit={handleRequestSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Waste Type</label>
                                    <select
                                        className="input-field"
                                        value={requestForm.wasteType}
                                        onChange={(e) => setRequestForm({ ...requestForm, wasteType: e.target.value })}
                                    >
                                        <option>Plastic</option>
                                        <option>Organic</option>
                                        <option>Metal</option>
                                        <option>Glass</option>
                                        <option>E-Waste</option>
                                        <option>Paper</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity (e.g., 5 kg)</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={requestForm.quantity}
                                        onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                                        required
                                        placeholder="Approx. weight"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={requestForm.location}
                                            onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                                            required
                                            placeholder="Pickup address"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleGetLocation('request')}
                                            className="bg-primary-50 text-primary-600 p-3 rounded-lg hover:bg-primary-100 transition-colors"
                                            title="Use current location"
                                        >
                                            <MapPin size={20} />
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary w-full py-3 shadow-lg shadow-primary-500/20">Submit Request</button>
                            </form>
                        </div>
                    </div>

                    {/* Request List */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <Clock size={20} className="text-gray-400" /> Your History
                        </h3>
                        {requests.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No requests found. Start by creating one!</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {requests.map((req) => (
                                    <div key={req._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex justify-between items-center group">
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div
                                                className={`p-3 rounded-full shrink-0 cursor-pointer hover:bg-opacity-80 transition ${req.wasteType === 'Organic' ? 'bg-green-100 text-green-600' :
                                                    req.wasteType === 'Plastic' ? 'bg-blue-100 text-blue-600' :
                                                        req.wasteType === 'E-Waste' ? 'bg-purple-100 text-purple-600' :
                                                            'bg-gray-100 text-gray-600'
                                                    }`}
                                                onClick={() => handleDeleteRequest(req._id)}
                                                title="Delete Request"
                                            >
                                                <Trash2 size={20} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900 truncate">{req.wasteType}</p>
                                                <p className="text-sm text-gray-500 mt-0.5 truncate" title={`${req.quantity} • ${req.location}`}>
                                                    {req.quantity} • {req.location}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${req.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                req.status === 'Approved' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="grid lg:grid-cols-[45%_55%] gap-8">
                    {/* Report Form */}
                    <div>
                        <div className="card sticky top-28 border-red-100">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                                <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
                                Report Issue
                            </h3>
                            <form onSubmit={handleReportSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={reportForm.location}
                                            onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                                            required
                                            placeholder="Location of dumping"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleGetLocation('report')}
                                            className="bg-red-50 text-red-600 p-3 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Use current location"
                                        >
                                            <MapPin size={20} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                                    <textarea
                                        className="input-field h-32 resize-none"
                                        value={reportForm.description}
                                        onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                        required
                                        placeholder="Describe the issue..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-danger w-full py-3 shadow-lg shadow-red-500/20">Submit Report</button>
                            </form>
                        </div>
                    </div>

                    {/* Report List */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                            <Clock size={20} className="text-gray-400" /> Your Reports
                        </h3>
                        {reports.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No reports found.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {reports.map((rep) => (
                                    <div key={rep._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex justify-between items-center">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-full bg-red-50 text-red-500">
                                                <AlertTriangle size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{rep.location}</p>
                                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{rep.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(rep.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide ${rep.status === 'Resolved' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                            }`}>
                                            {rep.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'centers' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {centers.map((center) => (
                        <div key={center._id} className="card group hover:border-primary-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${(center.currentLoad / center.capacity) > 0.8 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {Math.round((center.currentLoad / center.capacity) * 100)}% Full
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-gray-900">{center.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 flex items-center gap-1"><MapPin size={14} /> {center.address || center.location}</p>
                            {center.operatingHours && (
                                <p className="text-gray-500 text-sm mb-2 flex items-center gap-1"><Clock size={14} /> {center.operatingHours}</p>
                            )}
                            <p className="text-gray-500 text-sm mb-4 pb-4 border-b border-gray-100">{center.contact}</p>
                            <div className="flex flex-wrap gap-2">
                                {(center.acceptedWasteTypes?.length > 0 ? center.acceptedWasteTypes : center.acceptedMaterials).map((mat, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-md font-medium">
                                        {mat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'modules' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                            <Award size={20} className="text-yellow-500" /> Awareness Modules
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {modules.filter(m => !completedModules.includes(m._id)).length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No new modules available. You've completed them all!</p>
                            </div>
                        ) : (
                            modules
                                .filter(m => !completedModules.includes(m._id))
                                .map((module) => (
                                    <div key={module._id} className="card hover:border-yellow-200 flex flex-col">
                                        <h3 className="font-bold text-lg mb-2 text-gray-900">{module.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">{module.description}</p>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                <Award size={12} /> +{module.points} Points
                                            </span>
                                            <button
                                                onClick={() => setSelectedModule(module)}
                                                className="bg-primary-50 text-primary-600 border border-primary-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition"
                                            >
                                                Open
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            )}


            {/* Module Modal */}
            {
                selectedModule && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedModule.title}</h2>
                                    <span className="text-sm text-yellow-600 font-medium flex items-center gap-1 mt-1">
                                        <Award size={14} /> Earn {selectedModule.points} Points
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedModule(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                                    {selectedModule.content}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedModule(null)}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        handleModuleComplete(selectedModule._id);
                                        setSelectedModule(null);
                                    }}
                                    className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
                                >
                                    <CheckCircle size={18} /> Complete Module
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Dashboard;
