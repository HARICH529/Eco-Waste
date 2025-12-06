import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, MapPin, BarChart3, ShieldCheck, Truck, Leaf } from 'lucide-react';

const Home = () => {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-br from-primary-50 to-white">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold tracking-wide animate-fade-in-up">
                            <Leaf size={16} /> Sustainable Future
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            Revolutionizing <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Waste Management</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Connect with recycling centers, schedule pickups, and earn rewards. Join the movement towards a cleaner, greener planet today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-1 transition-all">
                                Get Started Now <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="btn-outline text-lg px-8 py-4 bg-white hover:bg-gray-50">
                                Existing User? Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-10 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                        <div>
                            <p className="text-4xl font-bold text-gray-900">500+</p>
                            <p className="text-gray-500 text-sm mt-1">Active Users</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-gray-900">1200kg</p>
                            <p className="text-gray-500 text-sm mt-1">Waste Recycled</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-gray-900">50+</p>
                            <p className="text-gray-500 text-sm mt-1">Centers Partnered</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-gray-900">24/7</p>
                            <p className="text-gray-500 text-sm mt-1">Support Available</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to manage waste</h2>
                        <p className="text-gray-600 text-lg">Our platform provides comprehensive tools for citizens and authorities to collaborate effectively.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card group hover:border-primary-200">
                            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Pickup Scheduling</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Request waste pickup at your convenience. Specify waste type, quantity, and location with ease.
                            </p>
                        </div>
                        <div className="card group hover:border-secondary-200">
                            <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center mb-6 text-secondary-600 group-hover:scale-110 transition-transform duration-300">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Interactive Center Locator</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Find the nearest recycling centers and drop-off points using our integrated map system.
                            </p>
                        </div>
                        <div className="card group hover:border-accent-200">
                            <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mb-6 text-accent-600 group-hover:scale-110 transition-transform duration-300">
                                <BarChart3 size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Impact Tracking & Rewards</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Monitor your contribution to the environment and earn redeemable points for responsible disposal.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-primary-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-900/20">
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to make a difference?</h2>
                            <p className="text-primary-100 max-w-2xl mx-auto text-xl leading-relaxed">
                                Join thousands of conscious citizens contributing to a cleaner, sustainable future for our cities.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link to="/register" className="bg-white text-primary-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition shadow-lg transform hover:-translate-y-1">
                                    Create Free Account
                                </Link>
                                <Link to="/login" className="bg-primary-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-primary-800 transition shadow-lg border border-primary-500">
                                    Login to Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Abstract Shapes */}
                        <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
