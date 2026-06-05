'use client';

const categoryColors: Record<string, string> = {
  CONSULTA: 'bg-blue-100 text-blue-700',
  CIRUGIA: 'bg-pink-100 text-pink-700',
  LABORATORIO: 'bg-gray-100 text-gray-700',
  IMAGENES: 'bg-purple-100 text-purple-700',
  VACUNAS: 'bg-yellow-100 text-yellow-700',
  PROCEDIMIENTOS: 'bg-orange-100 text-orange-700',
};

const categoryLabels: Record<string, string> = {
  CONSULTA: 'Consulta',
  CIRUGIA: 'Cirugía',
  LABORATORIO: 'Laboratorio',
  IMAGENES: 'Imágenes',
  VACUNAS: 'Vacunas',
  PROCEDIMIENTOS: 'Procedimientos',
};

interface CategoryBadgeProps {
  categoria: string;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ categoria, size = 'sm' }: CategoryBadgeProps) {
  const colorClass = categoryColors[categoria] || 'bg-gray-100 text-gray-700';
  const label = categoryLabels[categoria] || categoria;
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  );
}