import { regularExps } from "../../../config";


export class RegistroUsuarioDto {

    constructor(
        public nombre_usuario: string,
        public email: string,
        public clave: string
    ){
    }

    static create( object: { [key:string]:any } ): [string?, RegistroUsuarioDto?] {
        const { nombre_usuario, email, clave } = object;

        if( !nombre_usuario ) return ['Debe completar el nombre de usuario'];
        if( !email ) return ['Debe completar el email'];
        if( !regularExps.email.test( email ) ) return ['El formato del email no es válido.'];
        if ( !clave ) return ['Debe completar la clave'];
        if ( clave.length < 6 ) return ['La clave es demasiado corta.'];

        return [undefined, new RegistroUsuarioDto(nombre_usuario, email, clave)]

    }

}