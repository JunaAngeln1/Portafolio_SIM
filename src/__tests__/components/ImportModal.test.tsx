import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImportModal from '@/components/import/ImportModal';

const mockUseApp = {
  importarDatos: jest.fn(),
  limpiarTodosLosDatos: jest.fn(),
  clinicas: [
    { id: 'vet_1', nombre: 'Veterinaria San Francisco', ciudad: 'Bogotá', estado: 'activo' as const },
  ],
  servicios: [
    { id: 'srv_1', nombre: 'Consulta', clinicaId: 'vet_1', estado: 'activo' as const },
  ],
};

jest.mock('@/lib/store', () => ({
  useApp: () => mockUseApp,
}));

describe('ImportModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApp.importarDatos.mockResolvedValue({ clinicasImportadas: 1, serviciosImportados: 2 });
  });

  it('no debería renderizar cuando isOpen es false', () => {
    render(<ImportModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Importar Portafolios')).not.toBeInTheDocument();
  });

  it('debería renderizar el modal cuando isOpen es true', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Importar Portafolios')).toBeInTheDocument();
  });

  it('debería mostrar estadísticas de datos actuales', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getAllByText('1')).toHaveLength(2);
    expect(screen.getByText('Veterinarias')).toBeInTheDocument();
    expect(screen.getByText('Servicios')).toBeInTheDocument();
  });

  it('debería llamar a onClose al hacer clic en Cerrar', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Cerrar'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar botón de importar deshabilitado sin contenido', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const importBtn = screen.getByText('Importar').closest('button');
    expect(importBtn).toBeDisabled();
  });

  it('debería mostrar estructura JSON de ejemplo', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Estructura esperada del JSON')).toBeInTheDocument();
  });

  it('debería tener input de archivo aceptando .json', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('accept', '.json');
  });

  it('debería mostrar textarea para pegar JSON', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/veterinarias/);
    expect(textarea).toBeInTheDocument();
  });

  it('debería mostrar error con JSON inválido', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/veterinarias/);
    fireEvent.change(textarea, { target: { value: '{invalid json}' } });
    expect(screen.getByText('JSON inválido')).toBeInTheDocument();
  });

  it('debería habilitar botón importar con JSON válido', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/veterinarias/);
    const validJson = JSON.stringify({
      veterinarias: [{
        nombre: 'Test',
        ciudad: 'Bogotá',
        servicios: [{
          nombre: 'Consulta',
          categoria: 'CONSULTA',
          precio: 50000,
        }],
      }],
    });
    fireEvent.change(textarea, { target: { value: validJson } });
    const importBtn = screen.getByText('Importar').closest('button');
    expect(importBtn).not.toBeDisabled();
  });

  it('debería tener botón Limpiar Todo', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Limpiar Todo')).toBeInTheDocument();
  });

  it('debería mostrar confirmación al hacer clic en Limpiar Todo', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Limpiar Todo'));
    expect(screen.getByText('¿Eliminar todos los datos?')).toBeInTheDocument();
    expect(screen.getByText('Esta acción no se puede deshacer')).toBeInTheDocument();
  });

  it('debería cancelar limpieza al hacer clic en Cancelar', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Limpiar Todo'));
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByText('¿Eliminar todos los datos?')).not.toBeInTheDocument();
  });

  it('debería llamar limpiarTodosLosDatos al confirmar', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Limpiar Todo'));
    fireEvent.click(screen.getByText('Eliminar Todo'));
    expect(mockUseApp.limpiarTodosLosDatos).toHaveBeenCalledTimes(1);
  });

  it('debería limpiar textarea al hacer clic en Limpiar', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/veterinarias/);
    fireEvent.change(textarea, { target: { value: '{"test": true}' } });
    fireEvent.click(screen.getByText('Limpiar'));
    expect(textarea).toHaveValue('');
  });

  it('debería mostrar icono de archivo JSON', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Carga un archivo JSON con veterinarias y servicios')).toBeInTheDocument();
  });

  it('debería tener textarea con altura fija', () => {
    render(<ImportModal isOpen={true} onClose={mockOnClose} />);
    const textarea = screen.getByPlaceholderText(/veterinarias/);
    expect(textarea.className).toContain('h-48');
  });
});
