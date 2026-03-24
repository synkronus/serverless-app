'use client';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterCountry: string;
  onCountryChange: (value: string) => void;
  filterPlatform: string;
  onPlatformChange: (value: string) => void;
  filterAcademicLevel: string;
  onAcademicLevelChange: (value: string) => void;
  countries: string[];
  platforms: string[];
  onClearFilters: () => void;
}

const SEL = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function SearchBar({
  searchTerm,
  onSearchChange,
  filterCountry,
  onCountryChange,
  filterPlatform,
  onPlatformChange,
  filterAcademicLevel,
  onAcademicLevelChange,
  countries,
  platforms,
  onClearFilters,
}: SearchBarProps) {
  const hasActiveFilters = searchTerm !== '' || filterCountry !== '' || filterPlatform !== '' || filterAcademicLevel !== '';

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex items-end gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search (ID, Country, Platform)</label>
            <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Student ID or keyword..." className={SEL} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select value={filterCountry} onChange={(e) => onCountryChange(e.target.value)} className={SEL}>
              <option value="">All</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select value={filterPlatform} onChange={(e) => onPlatformChange(e.target.value)} className={SEL}>
              <option value="">All</option>
              {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Level</label>
            <select value={filterAcademicLevel} onChange={(e) => onAcademicLevelChange(e.target.value)} className={SEL}>
              <option value="">All</option>
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <div className="flex-shrink-0">
            <button onClick={onClearFilters} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium flex items-center gap-2" title="Clear all filters">
              <span>✕</span>
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

