'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/lib/types';

interface StudentFormProps {
  student: Student | null;
  onSubmit: (data: Student) => void;
  onCancel: () => void;
}

const INPUT = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function StudentForm({ student, onSubmit, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState<Student>({
    Student_ID: 0,
    Age: 18,
    Gender: 'Male',
    Academic_Level: 'Undergraduate',
    Country: '',
    Avg_Daily_Usage_Hours: 0,
    Most_Used_Platform: 'Instagram',
    Affects_Academic_Performance: 'No',
    Sleep_Hours_Per_Night: 7,
    Mental_Health_Score: 5,
    Relationship_Status: 'Single',
    Conflicts_Over_Social_Media: 0,
    Addicted_Score: 1,
  });

  useEffect(() => {
    if (student) setFormData(student);
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numFields = ['Student_ID', 'Age', 'Avg_Daily_Usage_Hours', 'Sleep_Hours_Per_Night', 'Mental_Health_Score', 'Conflicts_Over_Social_Media', 'Addicted_Score'];
    setFormData((prev) => ({
      ...prev,
      [name]: numFields.includes(name) ? (name === 'Avg_Daily_Usage_Hours' || name === 'Sleep_Hours_Per_Night' ? parseFloat(value) || 0 : parseInt(value) || 0) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {student ? 'Edit Record' : 'Add Record'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID *</label>
                <input type="number" name="Student_ID" value={formData.Student_ID} onChange={handleChange} required className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input type="number" name="Age" value={formData.Age} onChange={handleChange} required min="10" max="100" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select name="Gender" value={formData.Gender} onChange={handleChange} required className={INPUT}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Level *</label>
                <select name="Academic_Level" value={formData.Academic_Level} onChange={handleChange} required className={INPUT}>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input type="text" name="Country" value={formData.Country} onChange={handleChange} required className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Most Used Platform *</label>
                <select name="Most_Used_Platform" value={formData.Most_Used_Platform} onChange={handleChange} required className={INPUT}>
                  {['Instagram', 'Twitter', 'TikTok', 'YouTube', 'Facebook', 'Snapchat', 'WhatsApp', 'LinkedIn', 'Reddit', 'Pinterest', 'Telegram', 'Discord', 'Threads'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avg Daily Usage (h) *</label>
                <input type="number" name="Avg_Daily_Usage_Hours" value={formData.Avg_Daily_Usage_Hours} onChange={handleChange} required min="0" step="0.1" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Hours/Night *</label>
                <input type="number" name="Sleep_Hours_Per_Night" value={formData.Sleep_Hours_Per_Night} onChange={handleChange} required min="0" max="24" step="0.1" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affects Academic *</label>
                <select name="Affects_Academic_Performance" value={formData.Affects_Academic_Performance} onChange={handleChange} required className={INPUT}>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mental Health (1-10) *</label>
                <input type="number" name="Mental_Health_Score" value={formData.Mental_Health_Score} onChange={handleChange} required min="1" max="10" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Addiction Score (1-10) *</label>
                <input type="number" name="Addicted_Score" value={formData.Addicted_Score} onChange={handleChange} required min="1" max="10" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conflicts *</label>
                <input type="number" name="Conflicts_Over_Social_Media" value={formData.Conflicts_Over_Social_Media} onChange={handleChange} required min="0" className={INPUT} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                <select name="Relationship_Status" value={formData.Relationship_Status} onChange={handleChange} required className={INPUT}>
                  {['Single', 'In Relationship', 'Complicated', 'Married', 'Divorced'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">{student ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

