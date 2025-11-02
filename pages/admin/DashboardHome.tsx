
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import { UsersGroupIcon, BookOpenIcon, BellIcon, ArrowRightIcon } from '../../components/icons/Icons';

interface DashboardHomeProps {
    setView: (view: 'dashboard' | 'generate' | 'teachers' | 'classes') => void;
}

const NavCard: React.FC<{ title: string; description: string; icon: React.ReactNode; buttonText: string; onClick: () => void; }> = 
({ title, description, icon, buttonText, onClick }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
        <div className="flex items-start">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4 shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
        <button onClick={onClick} className="mt-auto pt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 self-start flex items-center">
            {buttonText} <ArrowRightIcon />
        </button>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ setView }) => {
    const { timetables } = useAppContext();

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todaysSchedule = timetables.flatMap(tt => tt.schedule.filter(d => d.day === today).flatMap(d => d.lectures))
                                    .sort((a, b) => a.time.localeCompare(b.time));

    const weeklyData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
        const lectures = timetables.flatMap(tt => tt.schedule.filter(d => d.day === day).flatMap(d => d.lectures)).length;
        return { name: day.substring(0, 3), lectures };
    });

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Weekly Lecture Distribution</h2>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} />
                                <Bar dataKey="lectures" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column: Today's Schedule */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Today's Schedule</h2>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
                        {todaysSchedule.length > 0 ? todaysSchedule.map((lecture, index) => (
                            <div key={index} className="p-3 bg-gray-50 border-l-4 border-indigo-400 rounded-r-md">
                                <p className="font-bold text-sm text-indigo-600">{lecture.time}</p>
                                <p className="text-gray-800 font-medium">{lecture.subject}</p>
                                <p className="text-xs text-gray-500">{lecture.teacher}</p>
                            </div>
                        )) : <p className="text-gray-500 text-center pt-10">No lectures scheduled for today.</p>}
                    </div>
                </div>

                {/* Bottom Row: Navigation Cards */}
                <NavCard 
                    title="Manage Teachers"
                    description="Add, edit, or remove teachers and their subjects."
                    icon={<UsersGroupIcon />}
                    buttonText="View All Teachers"
                    onClick={() => setView('teachers')}
                />
                 <NavCard 
                    title="Class Management"
                    description="Configure classes, sections, and timings."
                    icon={<BookOpenIcon />}
                    buttonText="Manage Classes"
                    onClick={() => setView('classes')}
                />
                 <NavCard 
                    title="Notifications"
                    description="View and manage system notifications."
                    icon={<BellIcon />}
                    buttonText="View Notifications"
                    onClick={() => alert('Notifications feature coming soon!')}
                />
            </div>
        </div>
    );
};

export default DashboardHome;