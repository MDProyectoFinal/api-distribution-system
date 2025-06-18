import { NextFunction, Request, Response } from "express";
import { recaptchaService } from "../servicios/recaptchaService";

/**
 * Interfaz para la respuesta de la API de Google reCAPTCHA.
 */
interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number; // Solo para v3
  action?: string; // Solo para v3
  'error-codes'?: string[];
  challenge_ts?: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZ)
  hostname?: string; // the hostname of the site where the reCAPTCHA was solved
}


export const verificarCaptcha = (accion: string, puntajeMinimo: number = 0.5) =>{
    return async(req: Request, res: Response, next: NextFunction) =>{
        const {captchaToken} = req.body

        if(!captchaToken){
            return res.status(400).json({ succes: false, mensaje: "token reCAPTCHA incompleto"});
        }


        try{

            const data: RecaptchaVerifyResponse  = await recaptchaService.verificarToken(captchaToken)

            if(!data.success){
                console.warn('verificación reCAPTCHA falló:', data['error-codes'])
                return res.status(400).json({ succes: false, mensaje: "falló la verificación reCAPTCHA"});
            }

             // Validar la acción si se proporciona y el score para reCAPTCHA v3
            if (data.action && data.action !== accion) {
                console.warn(`reCAPTCHA action mismatch. Expected: ${accion}, Received: ${data.action}`);
                return res.status(403).json({ success: false, message: 'Acción de seguridad no válida.' });
            }

            if (data.score !== undefined && data.score < puntajeMinimo) {
                console.warn(`reCAPTCHA puntaje muy bajo. Score: ${data.score}, Mínimo esperado: ${puntajeMinimo}`);
                return res.status(403).json({ success: false, message: 'Acceso denegado por sospecha de actividad no humana.' });
            }

            // Si todo es válido, continuar al siguiente middleware o a la lógica de la ruta
            console.log(`reCAPTCHA verification successful for action '${data.action || 'N/A'}' with score: ${data.score || 'N/A'}`);
            next();

        } catch (error: any) {
            console.error('Error during reCAPTCHA verification middleware:', error.message);
            return res.status(500).json({ success: false, message: 'Error interno del servidor al verificar reCAPTCHA.' });
    }

    }
}