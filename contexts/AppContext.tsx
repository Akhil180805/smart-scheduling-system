import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Teacher, Timetable } from '../types';
import { MOCK_TEACHERS, MOCK_TIMETABLES } from '../services/mockData';

type AppView = 'landing' | 'login' | 'register' | 'adminDashboard' | 'teacherDashboard';

interface AppContextType {
  appView: AppView;
  setAppView: (view: AppView) => void;
  user: User | null;
  login: (role: 'admin' | 'teacher', email: string, pass: string) => boolean;
  logout: () => void;
  teachers: Teacher[];
  registerTeacher: (teacherData: Omit<Teacher, 'id' | 'role' | 'age' | 'subjects' | 'yearSpecialization'> & { password?: string }) => void;
  deleteTeacher: (teacherId: string) => void;
  updateTeacherProfile: (updatedTeacher: Teacher) => void;
  timetables: Timetable[];
  addTimetable: (timetable: Timetable) => void;
  updateTimetable: (updatedTimetable: Timetable) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appView, setAppView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [timetables, setTimetables] = useState<Timetable[]>(MOCK_TIMETABLES);

  const login = (role: 'admin' | 'teacher', email: string, pass: string): boolean => {
    if (role === 'admin' && email === 'admin@test.com' && pass === 'admin123') {
      const adminUser: User = { id: 'admin01', name: 'Admin', email: 'admin@test.com', role: 'admin' };
      setUser(adminUser);
      setAppView('adminDashboard');
      return true;
    }
    if (role === 'teacher') {
      const teacherUser = teachers.find(t => t.email === email); // In real app, check hashed password
      if (teacherUser) {
        setUser(teacherUser);
        setAppView('teacherDashboard');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setAppView('landing');
  };

  const registerTeacher = (teacherData: Omit<Teacher, 'id' | 'role' | 'age' | 'subjects' | 'yearSpecialization'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t${Date.now()}`,
      role: 'teacher',
      age: 0, // Default value
      subjects: [], // Default value
      yearSpecialization: '', // Default value
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const updateTeacherProfile = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    if (user && user.id === updatedTeacher.id) {
        setUser(updatedTeacher);
    }
  };

  const addTimetable = (timetable: Timetable) => {
    setTimetables(prev => [...prev, timetable]);
  };

  const updateTimetable = (updatedTimetable: Timetable) => {
    setTimetables(prev => prev.map(t => t.id === updatedTimetable.id ? updatedTimetable : t));
  };


  return (
    <AppContext.Provider value={{ appView, setAppView, user, login, logout, teachers, registerTeacher, deleteTeacher, updateTeacherProfile, timetables, addTimetable, updateTimetable }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};