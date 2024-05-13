
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

export const bcryptAdapter = {

    hash: (password: string) => {
        const salt = genSaltSync(); // Genera un salt de 10 vueltas
        return hashSync(password, salt)
    },

    compare: (password:string, hashed: string) => {
        return compareSync(password, hashed); // Devuelve true  o false, segun comparacion
    }

}