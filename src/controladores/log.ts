
import { ILog, LogModel } from "../modelos/log";

export const LogController = {
    async obtenerLogs(req: Request, res: Response): Promise<void> {
      try {        
        const logs: any = await obtenerLogsDesdeLaBaseDeDatos();   
        console.log({ logsObtenidos: logs });
      } catch (error) {
        console.error('Error al obtener los logs:', error);
      }
    },
  
    async guardarLog( req: Request ): Promise<void> {
      try {
        const nuevoLog: any = req; // req.body si es log se enviara en el cuerpo de la solicitud
        await guardarLogEnLaBaseDeDatos(nuevoLog);
          
      } catch (error) {
        // Manejar el error de alguna manera apropiada
        console.error('Error al guardar el log:', error);        
      }
    }
  };


async function guardarLogEnLaBaseDeDatos( log: ILog ): Promise<void> {    
    try {
        const newLog = await LogModel.create(log);
        await newLog.save(); // No hace falta, es para asegurar.

        console.log( 'Creación de log:', newLog.id );
       
    } catch (error) {
        throw new Error('Error al guardar el log');
    }
    
}

async function obtenerLogsDesdeLaBaseDeDatos(): Promise<ILog[]>{   
    try {
        const logsEncontrados: any = await LogModel.find();       
        return logsEncontrados;
    } catch (error) {
        throw new Error('Error al obtener los registros de log');
    }
    
}

module.exports = {
    guardarLogEnLaBaseDeDatos,
    obtenerLogsDesdeLaBaseDeDatos,
    LogController
};