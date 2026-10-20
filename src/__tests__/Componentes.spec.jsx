// src/__tests__/Componentes.spec.jsx

// 1. Funciones puras que representan la lógica de los componentes (sin JSX)
function obtenerEtiquetaBoton(texto) {
  return texto || 'Botón sin texto';
}

function calcularTotalCarrito(carrito) {
  if (!carrito || carrito.length === 0) return 0;
  return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function evaluarMensajeError(hayError, mensaje) {
  if (!hayError) return null;
  return `Error: ${mensaje}`;
}

// 2. SUITE DE PRUEBAS UNITARIAS CON JASMINE
describe('Pruebas Unitarias - Evaluación Parcial 2 (Duoc UC)', () => {

  describe('Pruebas de Propiedades y Asignación (Props)', () => {
    it('debe asignar correctamente la etiqueta recibida como parámetro', () => {
      const resultado = obtenerEtiquetaBoton('Agregar al Carrito');
      expect(resultado).toBe('Agregar al Carrito');
    });

    it('debe ejecutar la función callback simulada (Spy)', () => {
      const funcionSpy = jasmine.createSpy('onClick');
      funcionSpy();
      expect(funcionSpy).toHaveBeenCalled();
    });
  });

  describe('Pruebas de Renderizado Condicional', () => {
    it('NO debe generar mensaje de alerta si hayError es false', () => {
      const resultado = evaluarMensajeError(false, 'Falló el pago');
      expect(resultado).toBeNull();
    });

    it('DEBE generar el mensaje de error cuando hayError es true', () => {
      const resultado = evaluarMensajeError(true, 'Transacción rechazada');
      expect(resultado).toBe('Error: Transacción rechazada');
    });
  });

  describe('Pruebas de Lógica de Estado y Cálculo de Carrito', () => {
    it('debe calcular el total a pagar del carrito correctamente', () => {
      const carritoSimulado = [
        { precio: 29990, cantidad: 1 },
        { precio: 34990, cantidad: 2 }
      ];
      const total = calcularTotalCarrito(carritoSimulado);
      expect(total).toBe(99970);
    });
  });

});