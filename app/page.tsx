'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/lib/types';
import StudentTable from '@/components/StudentTable';
import StudentForm from '@/components/StudentForm';
import CSVUploader from '@/components/CSVUploader';
import SearchBar from '@/components/SearchBar';
import ConfirmModal from '@/components/ConfirmModal';
import Pagination from '@/components/Pagination';
import DashboardCharts from '@/components/DashboardCharts';
import toast from 'react-hot-toast';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterAcademicLevel, setFilterAcademicLevel] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; student: Student | null }>({
    show: false,
    student: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCharts, setShowCharts] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCountry) params.append('country', filterCountry);
      if (filterPlatform) params.append('platform', filterPlatform);
      if (filterAcademicLevel) params.append('academicLevel', filterAcademicLevel);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/students?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
        setFilteredStudents(result.data);
        setCurrentPage(1);
      } else {
        toast.error('Error loading data');
      }
    } catch (error) {
      toast.error('Connection error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filterCountry, filterPlatform, filterAcademicLevel, searchTerm]);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setDeleteConfirm({ show: true, student });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.student?.id) return;
    try {
      const response = await fetch(`/api/students/${deleteConfirm.student.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        toast.success('Record deleted successfully');
        fetchStudents();
      } else {
        toast.error('Error deleting record');
      }
    } catch (error) {
      toast.error('Connection error');
      console.error(error);
    } finally {
      setDeleteConfirm({ show: false, student: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, student: null });
  };

  const handleFormSubmit = async (data: Student) => {
    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast.success(editingStudent ? 'Record updated' : 'Record created');
        setShowForm(false);
        setEditingStudent(null);
        fetchStudents();
      } else {
        toast.error(result.errors?.join(', ') || 'Error saving');
      }
    } catch (error) {
      toast.error('Connection error');
      console.error(error);
    }
  };

  const handleCSVUpload = () => setShowCSVUpload(true);
  const handleCSVImportComplete = () => { setShowCSVUpload(false); fetchStudents(); };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleItemsPerPageChange = (value: number) => { setItemsPerPage(value); setCurrentPage(1); };
  const handleClearFilters = () => { setSearchTerm(''); setFilterCountry(''); setFilterPlatform(''); setFilterAcademicLevel(''); };

  const countries = Array.from(new Set(students.map(s => s.Country))).sort();
  const platforms = Array.from(new Set(students.map(s => s.Most_Used_Platform))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Students Social Media Addiction</h1>
          <p className="mt-2 text-sm text-gray-600">Firebase Firestore + Next.js — Serverless Dataset Viewer</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <button onClick={() => setShowCharts(!showCharts)} className={`${showCharts ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 hover:bg-gray-600'} text-white px-4 py-2 rounded-lg font-medium transition-colors`}>{showCharts ? 'Hide Charts' : 'Show Charts'}</button>
            <button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">+ Add Record</button>
            <button onClick={handleCSVUpload} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Import CSV</button>
          </div>
          <div className="text-sm text-gray-600">Total: <span className="font-semibold">{filteredStudents.length}</span> records</div>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterCountry={filterCountry}
          onCountryChange={setFilterCountry}
          filterPlatform={filterPlatform}
          onPlatformChange={setFilterPlatform}
          filterAcademicLevel={filterAcademicLevel}
          onAcademicLevelChange={setFilterAcademicLevel}
          countries={countries}
          platforms={platforms}
          onClearFilters={handleClearFilters}
        />

        {showCharts && !loading && <DashboardCharts students={filteredStudents} />}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            <StudentTable students={paginatedStudents} onEdit={handleEditStudent} onDelete={handleDeleteStudent} />
            <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredStudents.length} itemsPerPage={itemsPerPage} startIndex={startIndex} endIndex={endIndex} onPageChange={handlePageChange} onItemsPerPageChange={handleItemsPerPageChange} />
          </>
        )}
      </main>

      {showForm && (
        <StudentForm student={editingStudent} onSubmit={handleFormSubmit} onCancel={() => { setShowForm(false); setEditingStudent(null); }} />
      )}

      {showCSVUpload && (
        <CSVUploader onComplete={handleCSVImportComplete} onCancel={() => setShowCSVUpload(false)} />
      )}

      {deleteConfirm.show && deleteConfirm.student && (
        <ConfirmModal
          title="Delete Record"
          message={`Are you sure you want to delete record #${deleteConfirm.student.Student_ID}?`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          type="danger"
        />
      )}
    </div>
  );
}
