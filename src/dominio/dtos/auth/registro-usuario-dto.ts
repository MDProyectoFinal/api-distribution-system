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

        if( !nombre_usuario ) return ['Missing name'];
        if( !email ) return ['Missing email'];
        if( !regularExps.email.test( email ) ) return ['Email is not valid'];
        if ( !clave ) return ['Missing clave'];
        if ( clave.length < 6 ) return ['Clave too short'];

        return [undefined, new RegistroUsuarioDto(nombre_usuario, email, clave)]

    }

}