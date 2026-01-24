// Color system for category badges - vibrant and distinctive
export const categoryColors = {
  'Life Abroad': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    accent: 'from-emerald-500 to-teal-600'
  },
  'Cost of Living': {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    accent: 'from-amber-500 to-orange-600'
  },
  'Cultural Adaptation': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    accent: 'from-purple-500 to-indigo-600'
  },
  'Quality of Life': {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-200',
    accent: 'from-rose-500 to-pink-600'
  },
  'School Intelligence': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    accent: 'from-blue-500 to-cyan-600'
  },
  'Country Guides': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    accent: 'from-green-500 to-emerald-600'
  },
  'Economic Data': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    accent: 'from-indigo-500 to-purple-600'
  },
  'School Reviews': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    accent: 'from-yellow-500 to-amber-600'
  },
  'Teacher Career': {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200',
    accent: 'from-teal-500 to-cyan-600'
  },
  'Contracts & Salaries': {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    accent: 'from-orange-500 to-red-600'
  },
  'Job Search & Hiring': {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    accent: 'from-cyan-500 to-blue-600'
  },
  'Professional Development': {
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    border: 'border-violet-200',
    accent: 'from-violet-500 to-purple-600'
  },
  'Uncategorized': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    accent: 'from-gray-500 to-slate-600'
  }
};

export function getCategoryColor(category) {
  return categoryColors[category] || categoryColors['Uncategorized'];
}