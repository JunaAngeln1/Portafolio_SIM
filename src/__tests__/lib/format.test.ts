import { formatearPrecio } from '@/lib/format';

describe('formatearPrecio', () => {
  it('debería formatear precio entero', () => {
    const resultado = formatearPrecio(50000);
    expect(resultado).toMatch(/50\.?000/);
  });

  it('debería formatear precio 0', () => {
    const resultado = formatearPrecio(0);
    expect(resultado).toMatch(/0/);
  });

  it('debería formatear precio grande', () => {
    const resultado = formatearPrecio(1000000);
    expect(resultado).toMatch(/1\.?000\.?000/);
  });

  it('debería formatear precio pequeño', () => {
    const resultado = formatearPrecio(1000);
    expect(resultado).toMatch(/1\.?000/);
  });

  it('debería formatear precio negativo', () => {
    const resultado = formatearPrecio(-50000);
    expect(resultado).toMatch(/50\.?000/);
    expect(resultado).toMatch(/-/);
  });

  it('debería usar moneda COP', () => {
    const resultado = formatearPrecio(10000);
    // COP format typically includes $ or COP
    expect(resultado).toMatch(/\$|COP/);
  });

  it('no debería incluir decimales', () => {
    const resultado = formatearPrecio(10000);
    expect(resultado).not.toMatch(/,00/);
  });
});
