import { ImportData } from './types';

const VALID_CATEGORIES = ['CONSULTA', 'CIRUGIA', 'LABORATORIO', 'IMAGENES', 'VACUNAS', 'PROCEDIMIENTOS'];
const VALID_MODES = ['EN_SEDE', 'A_DOMICILIO', 'AMBOS'];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_VETERINARIAS = 50;
const MAX_SERVICIOS_POR_VETERINARIA = 100;

interface ValidationError {
  field: string;
  message: string;
}

export function validarImportData(data: unknown): { valid: true; data: ImportData } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: [{ field: 'root', message: 'El dato no es un objeto válido' }] };
  }

  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.veterinarias)) {
    return { valid: false, errors: [{ field: 'veterinarias', message: 'El campo "veterinarias" debe ser un array' }] };
  }

  if (obj.veterinarias.length === 0) {
    return { valid: false, errors: [{ field: 'veterinarias', message: 'El array "veterinarias" está vacío' }] };
  }

  if (obj.veterinarias.length > MAX_VETERINARIAS) {
    return { valid: false, errors: [{ field: 'veterinarias', message: `Máximo ${MAX_VETERINARIAS} veterinarias por importación` }] };
  }

  obj.veterinarias.forEach((vet, vetIndex) => {
    const prefix = `veterinarias[${vetIndex}]`;

    if (!vet || typeof vet !== 'object') {
      errors.push({ field: prefix, message: 'Debe ser un objeto válido' });
      return;
    }

    const v = vet as Record<string, unknown>;

    if (typeof v.nombre !== 'string' || v.nombre.trim() === '') {
      errors.push({ field: `${prefix}.nombre`, message: 'Nombre es requerido y debe ser texto' });
    }

    if (typeof v.ciudad !== 'string' || v.ciudad.trim() === '') {
      errors.push({ field: `${prefix}.ciudad`, message: 'Ciudad es requerida y debe ser texto' });
    }

    if (v.servicios !== undefined) {
      if (!Array.isArray(v.servicios)) {
        errors.push({ field: `${prefix}.servicios`, message: 'Debe ser un array' });
      } else if (v.servicios.length > MAX_SERVICIOS_POR_VETERINARIA) {
        errors.push({ field: `${prefix}.servicios`, message: `Máximo ${MAX_SERVICIOS_POR_VETERINARIA} servicios por veterinaria` });
      } else {
        v.servicios.forEach((srv, srvIndex) => {
          const srvPrefix = `${prefix}.servicios[${srvIndex}]`;

          if (!srv || typeof srv !== 'object') {
            errors.push({ field: srvPrefix, message: 'Debe ser un objeto válido' });
            return;
          }

          const s = srv as Record<string, unknown>;

          if (typeof s.nombre !== 'string' || s.nombre.trim() === '') {
            errors.push({ field: `${srvPrefix}.nombre`, message: 'Nombre del servicio es requerido' });
          }

          if (typeof s.categoria !== 'string' || !VALID_CATEGORIES.includes(s.categoria)) {
            errors.push({ field: `${srvPrefix}.categoria`, message: `Categoría inválida. Válidas: ${VALID_CATEGORIES.join(', ')}` });
          }

          if (s.precio !== undefined && (typeof s.precio !== 'number' || s.precio < 0)) {
            errors.push({ field: `${srvPrefix}.precio`, message: 'Precio debe ser un número positivo' });
          }

          if (s.modo_servicio !== undefined && (typeof s.modo_servicio !== 'string' || !VALID_MODES.includes(s.modo_servicio))) {
            errors.push({ field: `${srvPrefix}.modo_servicio`, message: `Modo inválido. Válidos: ${VALID_MODES.join(', ')}` });
          }
        });
      }
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: data as ImportData };
}

export function validarTamanioArchivo(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    const tamanioMB = (file.size / (1024 * 1024)).toFixed(1);
    return `El archivo es demasiado grande (${tamanioMB}MB). Máximo permitido: 1MB`;
  }
  return null;
}
