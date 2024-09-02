export const MAX_TAMAÑO_PAGINA = 20
export default interface IParametrosPaginacion {
  numeroPagina: number
  busqueda: string
  tamañoPagina: number
}

export enum TipoRecursoUri {
  PAGINA_ANTERIOR,
  PAGINA_SIGUIENTE,
  ACTUAL,
}

export class InfoLinkPaginacion {
  constructor(public numeroPagina: number, public tamañoPagina: number, public busqueda: string){
  }

  toQueryString() : string{
    let qsArray = []

    if(this.busqueda){
      qsArray.push(`buscar=${this.busqueda}`)
    }

    qsArray.push(`numeroPagina=${this.numeroPagina}`)
    qsArray.push(`tamañoPagina=${this.tamañoPagina}`)

    return qsArray.join('&')
  }

}


export class MetaDataPaginacion {

    constructor(public total:number, public tamañoPagina:number,public paginaActual:number, public totalPaginas:number, public linkAnterior? : string|null, public linkSiguiente?:string|null){
    }

}

export function crearUrlPaginacion(urlRecurso :string,  parametrosConsulta: IParametrosPaginacion, tipoRecurso: TipoRecursoUri): string {

    const metadata = crearInformacionLink(tipoRecurso, parametrosConsulta)
    return  urlRecurso + metadata.toQueryString()
}


function crearInformacionLink(tipoRecurso: TipoRecursoUri, parametrosConsulta: IParametrosPaginacion) : InfoLinkPaginacion{
    switch (tipoRecurso) {
        case TipoRecursoUri.PAGINA_ANTERIOR:
            return new InfoLinkPaginacion(parametrosConsulta.numeroPagina - 1, parametrosConsulta.tamañoPagina, parametrosConsulta.busqueda)
        case TipoRecursoUri.PAGINA_SIGUIENTE:
            return new InfoLinkPaginacion(parametrosConsulta.numeroPagina + 1, parametrosConsulta.tamañoPagina, parametrosConsulta.busqueda)
        case TipoRecursoUri.ACTUAL:
        default:
            return new InfoLinkPaginacion(parametrosConsulta.numeroPagina, parametrosConsulta.tamañoPagina, parametrosConsulta.busqueda)
    }
}

