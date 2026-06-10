'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/lib/store';
import { validarImportData, validarTamanioArchivo } from '@/lib/importValidation';
import { X, Upload, FileJson, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { importarDatos, limpiarTodosLosDatos, clinicas, servicios } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jsonContent, setJsonContent] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{ clinicasImportadas: number; serviciosImportados: number } | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tamanioError = validarTamanioArchivo(file);
    if (tamanioError) {
      setParseError(tamanioError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      try {
        JSON.parse(content);
        setParseError(null);
      } catch {
        setParseError('El archivo no contiene JSON válido');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonContent) return;
    
    try {
      const parsed = JSON.parse(jsonContent);
      const validation = validarImportData(parsed);
      
      if (!validation.valid) {
        const primerError = validation.errors[0];
        if (primerError) {
          setParseError(`Error en ${primerError.field}: ${primerError.message}`);
        } else {
          setParseError('Error de validación desconocido');
        }
        return;
      }

      const result = await importarDatos(validation.data);
      setImportResult(result);
      setJsonContent('');
      setParseError(null);
    } catch {
      setParseError('Error al parsear el JSON. Verifica la estructura.');
    }
  };

  const handleClearAll = () => {
    limpiarTodosLosDatos();
    setShowConfirmClear(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="import-modal-title">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-modal max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileJson className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 id="import-modal-title" className="text-xl font-semibold text-gray-900">Importar Portafolios</h3>
              <p className="text-sm text-gray-500">Carga un archivo JSON con veterinarias y servicios</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Cerrar">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {importResult && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-800">Importación exitosa</p>
                  <p className="text-sm text-emerald-600">
                    {importResult.clinicasImportadas} veterinarias y {importResult.serviciosImportados} servicios importados
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Datos Actuales</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{clinicas.length}</p>
                <p className="text-sm text-gray-500">Veterinarias</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{servicios.length}</p>
                <p className="text-sm text-gray-500">Servicios</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Cargar desde Archivo</h4>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
              role="button"
              tabIndex={0}
              aria-label="Cargar archivo JSON"
            >
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">Haz clic o arrastra un archivo JSON aquí</p>
              <p className="text-sm text-gray-400">Formato: .json</p>
              <input 
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">O pega el JSON directamente</h4>
              {jsonContent && (
                <button
                  onClick={() => { setJsonContent(''); setParseError(null); }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Limpiar
                </button>
              )}
            </div>
            <textarea
              value={jsonContent}
              onChange={(e) => {
                setJsonContent(e.target.value);
                try {
                  JSON.parse(e.target.value);
                  setParseError(null);
                } catch {
                  setParseError('JSON inválido');
                }
              }}
              placeholder={`{\n  "veterinarias": [\n    {\n      "nombre": "Mi Veterinaria",\n      "ciudad": "Bogotá",\n      "servicio_domicilio": true,\n      "servicios": [\n        {\n          "nombre": "Consulta General",\n          "categoria": "CONSULTA",\n          "precio": 45000,\n          "precio_descuento": 38000\n        }\n      ]\n    }\n  ]\n}`}
              className="w-full h-48 px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm resize-none"
            />
            {parseError && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{parseError}</span>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">Estructura esperada del JSON</h4>
            <pre className="text-xs text-blue-800 overflow-x-auto">{`{
  "veterinarias": [
    {
      "nombre": "Nombre de la veterinaria",
      "ciudad": "Ciudad",
      "direccion": "Dirección (opcional)",
      "servicio_domicilio": true/false,
      "servicios": [
        {
          "nombre": "Nombre del servicio",
          "categoria": "CONSULTA|CIRUGIA|LABORATORIO|IMAGENES|VACUNAS|PROCEDIMIENTOS",
          "descripcion": "Descripción (opcional)",
          "precio": 50000,
          "precio_descuento": 42000,
          "modo_servicio": "EN_SEDE|A_DOMICILIO|AMBOS (opcional)"
        }
      ]
    }
  ]
}`}</pre>
            <p className="text-xs text-blue-600 mt-2">• <strong>precio</strong>: precio particular (regular) — siempre requerido</p>
            <p className="text-xs text-blue-600">• <strong>precio_descuento</strong>: precio SIM (con descuento) — null si no aplica</p>
          </div>
        </div>

        <div className="p-6 border-t flex items-center justify-between">
          <button
            onClick={() => setShowConfirmClear(true)}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar Todo
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-border rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleImport}
              disabled={!jsonContent || parseError !== null}
              className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar
            </button>
          </div>
        </div>
      </div>

      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-modal">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">¿Eliminar todos los datos?</h3>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Se eliminarán <strong>{clinicas.length}</strong> veterinarias y <strong>{servicios.length}</strong> servicios del sistema.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Eliminar Todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}