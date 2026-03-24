'use client';

import { useMemo } from 'react';
import { Student } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'];

interface DashboardChartsProps {
  students: Student[];
}

function avg(nums: number[]) {
  return nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : 0;
}

function pctLabel(props: PieLabelRenderProps) {
  const name = typeof props.name === 'string' ? props.name : '';
  const percent = typeof props.percent === 'number' ? props.percent : 0;
  return `${name} ${(percent * 100).toFixed(0)}%`;
}

export default function DashboardCharts({ students }: DashboardChartsProps) {
  const scoreDistribution = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 0; i <= 10; i++) counts[i] = 0;
    students.forEach(s => { const k = Math.round(s.Addicted_Score); if (k >= 0 && k <= 10) counts[k]++; });
    return Object.entries(counts).map(([score, count]) => ({ score: Number(score), count }));
  }, [students]);

  const usageByPlatform = useMemo(() => {
    const map: Record<string, number[]> = {};
    students.forEach(s => { (map[s.Most_Used_Platform] ??= []).push(s.Avg_Daily_Usage_Hours); });
    return Object.entries(map).map(([platform, hrs]) => ({ platform, avgHours: avg(hrs) })).sort((a, b) => b.avgHours - a.avgHours);
  }, [students]);

  const scoreByLevel = useMemo(() => {
    const map: Record<string, number[]> = {};
    students.forEach(s => { (map[s.Academic_Level] ??= []).push(s.Addicted_Score); });
    return Object.entries(map).map(([level, scores]) => ({ level, avgScore: avg(scores) }));
  }, [students]);

  const genderData = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach(s => { map[s.Gender] = (map[s.Gender] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [students]);

  const perfData = useMemo(() => {
    const map: Record<string, number> = { Yes: 0, No: 0 };
    students.forEach(s => { map[s.Affects_Academic_Performance]++; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [students]);

  const scatterData = useMemo(() =>
    students.map(s => ({ x: s.Addicted_Score, y: s.Mental_Health_Score })),
  [students]);

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center mb-6">
        <p className="text-gray-500 text-lg">No data available for charts</p>
      </div>
    );
  }

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-80">{children}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card title="Addiction Score Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="score" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Avg Daily Usage by Platform">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usageByPlatform} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="platform" type="category" width={90} />
            <Tooltip />
            <Bar dataKey="avgHours" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Addiction Score by Academic Level">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreByLevel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Bar dataKey="avgScore" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Gender Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label={pctLabel}>
              {genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Affects Academic Performance">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={perfData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label={pctLabel}>
              {perfData.map((entry, i) => <Cell key={i} fill={entry.name === 'Yes' ? '#ef4444' : '#10b981'} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Mental Health vs Addiction Score">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name="Addiction Score" type="number" domain={[0, 10]} />
            <YAxis dataKey="y" name="Mental Health" type="number" domain={[0, 10]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={scatterData} fill="#8b5cf6" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

