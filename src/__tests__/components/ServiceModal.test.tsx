import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServiceModal from '@/components/portfolio/ServiceModal';
import { Service } from '@/lib/types';

const mockClinicas = [
  { id: 'vet_1', nombre: 'Veterinaria San Francisco', ciudad: 'Bogotá' },
  { id: 'vet_2', nombre: 'Veterinaria La Mascota', ciudad: 'Medellín' },
];

const mockServicio: Service = {
  id: 'srv_1',
  categoria: 'CONSULTA',
  nombre: 'Consulta General',
  descripcion: 'Consulta veterinaria',
  precio: 50000,
  precioDescuento: 42000,
  proveedor: 'Veterinaria San Francisco',
  clinicaId: 'vet_1',
  ciudad: 'Bogotá',
  modoServicio: 'EN_SEDE',
  estado: 'activo',
  fechaCreacion: '2024-01-01',
  fechaActualizacion: '2024-01-01',
};

describe('ServiceModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('no debería renderizar cuando isOpen es false', () => {
    render(
      <ServiceModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    expect(screen.queryByText('Agregar Nuevo Servicio')).not.toBeInTheDocument();
  });

  it('debería renderizar formulario de creación cuando isOpen es true', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    expect(screen.getByText('Agregar Nuevo Servicio')).toBeInTheDocument();
  });

  it('debería renderizar formulario de edición con datos del servicio', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} servicio={mockServicio} clinicas={mockClinicas} />
    );
    expect(screen.getByText('Editar Servicio')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Consulta General')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Consulta veterinaria')).toBeInTheDocument();
  });

  it('debería llamar a onClose al hacer clic en Cancelar', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar veterinarias en el select', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    expect(screen.getByText('Veterinaria San Francisco - Bogotá')).toBeInTheDocument();
    expect(screen.getByText('Veterinaria La Mascota - Medellín')).toBeInTheDocument();
  });

  it('debería actualizar nombre al escribir en el input', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    const nombreInput = screen.getAllByRole('textbox')[0]!;
    fireEvent.change(nombreInput, { target: { value: 'Nuevo Servicio' } });
    expect(nombreInput).toHaveValue('Nuevo Servicio');
  });

  it('debería actualizar precio al escribir en el input', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    const precioInput = screen.getAllByRole('spinbutton')[0]!;
    fireEvent.change(precioInput, { target: { value: '75000' } });
    expect(precioInput).toHaveValue(75000);
  });

  it('debería llamar a onSave con datos correctos al enviar', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    fireEvent.change(screen.getAllByRole('textbox')[0]!, { target: { value: 'Test Service' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0]!, { target: { value: '60000' } });
    fireEvent.click(screen.getByText('Agregar Servicio'));

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ nombre: 'Test Service', precio: 60000 })
    );
  });

  it('debería incluir proveedor y ciudad de la clínica seleccionada', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    fireEvent.change(screen.getAllByRole('textbox')[0]!, { target: { value: 'Test' } });
    fireEvent.change(screen.getAllByRole('spinbutton')[0]!, { target: { value: '50000' } });
    fireEvent.click(screen.getByText('Agregar Servicio'));

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ proveedor: 'Veterinaria San Francisco', ciudad: 'Bogotá' })
    );
  });

  it('debería cambiar categoría al seleccionar otra opción', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.change(comboboxes[0]!, { target: { value: 'CIRUGIA' } });
    expect(comboboxes[0]).toHaveValue('CIRUGIA');
  });

  it('debería cambiar modo de servicio al seleccionar otra opción', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.change(comboboxes[2]!, { target: { value: 'A_DOMICILIO' } });
    expect(comboboxes[2]).toHaveValue('A_DOMICILIO');
  });

  it('debería cambiar estado al seleccionar inactivo', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} clinicas={mockClinicas} />
    );
    const comboboxes = screen.getAllByRole('combobox');
    fireEvent.change(comboboxes[3]!, { target: { value: 'inactivo' } });
    expect(comboboxes[3]).toHaveValue('inactivo');
  });

  it('debería manejar precioDescuento null correctamente', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave}
        servicio={{ ...mockServicio, precioDescuento: null }} clinicas={mockClinicas} />
    );
    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons[1]).toHaveValue(null);
  });

  it('debería mostrar precioDescuento cuando tiene valor', () => {
    render(
      <ServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave}
        servicio={mockServicio} clinicas={mockClinicas} />
    );
    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons[1]).toHaveValue(42000);
  });
});
