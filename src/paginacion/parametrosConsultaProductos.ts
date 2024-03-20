import IParametrosPaginacion, { MAX_TAMAÑO_PAGINA } from './index'

export default class ParametrosConsultaProducto implements IParametrosPaginacion {
  constructor()
  constructor(numeroPagina: number, busqueda: string, tamañoPagina: number)
  constructor(numeroPagina?: number, busqueda?: string, tamañoPagina?: number) {

    this.numeroPagina = numeroPagina || 1
    this.busqueda = busqueda || ''
    this.tamañoPagina = definirTamañoPagina(tamañoPagina)
  }

  numeroPagina: number
  busqueda: string
  tamañoPagina: number
}

function definirTamañoPagina(tamañoPagina: number | undefined): number {
  if (!tamañoPagina) {
    return 10 // Por defecto
  }

  if (tamañoPagina > MAX_TAMAÑO_PAGINA) {
    return MAX_TAMAÑO_PAGINA
  }

  return tamañoPagina
}
