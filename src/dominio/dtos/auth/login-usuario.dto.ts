import { regularExps } from "../../../config";


export class LoginUsuarioDto {

    constructor(
        public email: string,
        public clave: string | null | undefined
    ){
    }

    static create( object: { [key:string]:any } ): [string?, LoginUsuarioDto?] {
        const { email, clave } = object;

        if( !email ) return ['Missing email'];
        if( !regularExps.email.test( email ) ) return ['Email is not valid'];
        if ( !clave ) return ['Missing clave'];
        return [undefined, new LoginUsuarioDto( email, clave)]

    }

}