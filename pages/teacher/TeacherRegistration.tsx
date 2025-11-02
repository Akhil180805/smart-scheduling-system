import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Teacher } from '../../types';
import { DEPARTMENTS } from '../../services/mockData';
import { CalendarScheduleIcon, ChevronLeftIcon } from '../../components/icons/Icons';
import Select from '../../components/common/Select';

const TeacherRegistration: React.FC = () => {
  const { registerTeacher, setAppView } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    qualification: '',
    department: DEPARTMENTS[0],
    location: '',
    experience: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
        setError("Please fill in all required fields.");
        return;
    }
    
    registerTeacher(formData);
    alert('Registration successful! Please login.');
    setAppView('login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-4">
       <div className="w-full max-w-2xl">
         <button onClick={() => setAppView('login')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeftIcon />
          <span className="ml-1">Back to login</span>
        </button>
        <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-blue-600 p-3 rounded-xl mb-3">
                  <CalendarScheduleIcon />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Teacher Registration</h1>
                <p className="text-gray-500">Create your account</p>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Register as Teacher</h3>
            <p className="text-sm text-gray-500 mb-6">Fill in your details to create an account</p>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name *" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    <Input label="Email *" name="email" type="email" placeholder="teacher@school.edu" value={formData.email} onChange={handleChange} required />
                    <Input label="Password *" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    <Input label="Phone Number *" name="phoneNumber" type="tel" placeholder="+1 234 567 8900" value={formData.phoneNumber} onChange={handleChange} required />
                    <Input label="Qualifications *" name="qualification" type="text" placeholder="M.Sc. B.Ed" value={formData.qualification} onChange={handleChange} required />
                    <Select label="Department *" name="department" value={formData.department} onChange={handleChange}>
                        {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </Select>
                    <Input label="Official Location *" name="location" type="text" placeholder="Main Campus" value={formData.location} onChange={handleChange} required />
                    <Input label="Experience *" name="experience" type="text" placeholder="5 years" value={formData.experience} onChange={handleChange} required />
                </div>
              
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              
              <div className="pt-4">
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-md">
                  Register
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegistration;