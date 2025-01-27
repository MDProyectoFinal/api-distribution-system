import { regularExps } from "../../../config";


export class LoginUsuarioDto {

    constructor(
        public email: string,
        public clave: string | null | undefined
    ){
    }

    static create( object: { [key:string]:any } ): [string?, LoginUsuarioDto?] {
        const { email, clave } = object;

        if( !email ) return ['Email no ingresado.'];
        if( !regularExps.email.test( email ) ) return ['El formate del email no es valido.'];
        if ( !clave ) return ['Clave no ingresada'];
        return [undefined, new LoginUsuarioDto( email, clave)]

    }

}