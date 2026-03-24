'use client';

import { Student } from '@/lib/types';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

function scoreBadge(score: number, max: number) {
  const ratio = score / max;
  const color = ratio >= 0.7 ? 'bg-red-100 text-red-800' : ratio >= 0.4 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>{score}</span>;
}

export default function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">No records found</p>
        <p className="text-gray-400 text-sm mt-2">
          Add a record or import from a CSV file
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demographics</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage (h/d)</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Addiction</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mental Health</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.Student_ID}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{s.Gender}, {s.Age}y</div>
                  <div className="text-sm text-gray-500">{s.Country}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{s.Academic_Level}</div>
                  <div className="text-sm text-gray-500">Affects: {s.Affects_Academic_Performance}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{s.Most_Used_Platform}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{s.Avg_Daily_Usage_Hours}</td>
                <td className="px-4 py-4 whitespace-nowrap">{scoreBadge(s.Addicted_Score, 10)}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {scoreBadge(10 - s.Mental_Health_Score, 10)}
                  <div className="text-xs text-gray-500 mt-1">Sleep: {s.Sleep_Hours_Per_Night}h</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => onEdit(s)} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button onClick={() => onDelete(s)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

