


export class ErrorPersonalizado extends Error {

    constructor(
        public readonly statusCode: number,
        public readonly message: string,
    ){
        super( message );
    }

    /// «Mala petición». El servidor no puede devolver una respuesta debido a un error del cliente.
    static badRequest( message: string ){        
        return new ErrorPersonalizado( 400, message );
    }

    static unauthorized( message: string ){        
        return new ErrorPersonalizado( 401, message );
    }

    static forbidden( message: string ){        
        return new ErrorPersonalizado( 403, message );
    }

    static notFound( message: string ){        
        return new ErrorPersonalizado( 404, message );
    }

    static internalServer( message: string ){        
        return new ErrorPersonalizado( 500, message );
    }

}