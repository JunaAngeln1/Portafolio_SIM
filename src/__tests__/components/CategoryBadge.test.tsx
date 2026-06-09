import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryBadge from '@/components/portfolio/CategoryBadge';

describe('CategoryBadge', () => {
  it('debería renderizar categoría CONSULTA con color azul', () => {
    render(<CategoryBadge categoria="CONSULTA" />);
    const badge = screen.getByText('Consulta');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('blue');
  });

  it('debería renderizar categoría CIRUGIA con color rosa', () => {
    render(<CategoryBadge categoria="CIRUGIA" />);
    const badge = screen.getByText('Cirugía');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('pink');
  });

  it('debería renderizar categoría LABORATORIO con color gris', () => {
    render(<CategoryBadge categoria="LABORATORIO" />);
    const badge = screen.getByText('Laboratorio');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('gray');
  });

  it('debería renderizar categoría IMAGENES con color morado', () => {
    render(<CategoryBadge categoria="IMAGENES" />);
    const badge = screen.getByText('Imágenes');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('purple');
  });

  it('debería renderizar categoría VACUNAS con color amarillo', () => {
    render(<CategoryBadge categoria="VACUNAS" />);
    const badge = screen.getByText('Vacunas');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('yellow');
  });

  it('debería renderizar categoría PROCEDIMIENTOS con color naranja', () => {
    render(<CategoryBadge categoria="PROCEDIMIENTOS" />);
    const badge = screen.getByText('Procedimientos');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('orange');
  });

  it('debería usar tamaño sm por defecto', () => {
    render(<CategoryBadge categoria="CONSULTA" />);
    const badge = screen.getByText('Consulta');
    expect(badge.className).toContain('text-xs');
  });

  it('debería usar tamaño md cuando se especifica', () => {
    render(<CategoryBadge categoria="CONSULTA" size="md" />);
    const badge = screen.getByText('Consulta');
    expect(badge.className).toContain('text-sm');
  });

  it('debería mostrar texto crudo para categoría desconocida', () => {
    render(<CategoryBadge categoria="OTRO" />);
    const badge = screen.getByText('OTRO');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('gray');
  });
});
