'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

interface CSVUploaderProps {
  onComplete: () => void;
  onCancel: () => void;
}

export default function CSVUploader({ onComplete, onCancel }: CSVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error('Por favor selecciona un archivo CSV');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast.error('Por favor selecciona un archivo CSV');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/students/import-csv', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `${result.imported} records imported successfully` +
          (result.failed > 0 ? ` (${result.failed} failed)` : '')
        );
        
        if (result.errors && result.errors.length > 0) {
          console.warn('Errores de importación:', result.errors);
        }
        
        onComplete();
      } else {
        toast.error(result.error || 'Error al importar CSV');
        if (result.validationErrors) {
          console.error('Errores de validación:', result.validationErrors);
        }
      }
    } catch (error) {
      toast.error('Error de conexión');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Import Records from CSV
        </h2>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            The CSV file must contain the following columns:
          </p>
          <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-x-auto">
            Student_ID,Age,Gender,Academic_Level,Country,Avg_Daily_Usage_Hours,Most_Used_Platform,Affects_Academic_Performance,Sleep_Hours_Per_Night,Mental_Health_Score,Relationship_Status,Conflicts_Over_Social_Media,Addicted_Score
          </div>
        </div>

        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div>
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <button
                onClick={() => setFile(null)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Cambiar archivo
              </button>
            </div>
          ) : (
            <div>
              <div className="text-gray-400 text-4xl mb-2">📁</div>
              <p className="text-sm text-gray-600 mb-2">
                Arrastra y suelta tu archivo CSV aquí
              </p>
              <p className="text-xs text-gray-500 mb-4">o</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Seleccionar Archivo
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Importando...' : 'Importar'}
          </button>
        </div>

        {/* Download Sample */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href="/sample-students.csv"
            download
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            📥 Descargar archivo CSV de ejemplo
          </a>
        </div>
      </div>
    </div>
  );
}

