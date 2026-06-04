export type ServiceCategory = 
  | 'CONSULTA'
  | 'CIRUGIA'
  | 'LABORATORIO'
  | 'IMAGENES'
  | 'VACUNAS'
  | 'PROCEDIMIENTOS';

export type ServiceMode = 'EN_SEDE' | 'A_DOMICILIO' | 'AMBOS';

export interface VeterinaryClinic {
  id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  servicioDomicilio: boolean;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Service {
  id: string;
  categoria: ServiceCategory;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento: number | null;
  proveedor: string;
  clinicaId: string;
  ciudad: string;
  modoServicio: ServiceMode;
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface FilterState {
  clinicaId: string;
  ciudad: string;
  categoria: string;
  proveedor: string;
  modoServicio: string;
  estado: string;
  busqueda: string;
  rangoFechas: {
    desde: string;
    hasta: string;
  };
}

export interface ImportData {
  veterinarias: {
    nombre: string;
    ciudad: string;
    direccion?: string;
    servicio_domicilio?: boolean;
    servicios: {
      nombre: string;
      categoria: string;
      descripcion?: string;
      precio: number;
      precio_descuento?: number | null;
      modo_servicio?: string;
    }[];
  }[];
}

export interface StoredData {
  clinicas: VeterinaryClinic[];
  servicios: Service[];
  ultimaActualizacion: string;
}
