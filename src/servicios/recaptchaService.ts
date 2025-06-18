import axios from 'axios';

export class RecaptchaService {
  private secretKey: string;
  private verifyUrl: string = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error('No se proporcionó RECAPTCHA_SECRET_KEY');
    }
    this.secretKey = secretKey;
  }

  public async verificarToken(token: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.verifyUrl}?secret=${this.secretKey}&response=${token}`
      );
      return response.data;
    } catch (error : any) {

        console.error('Error contacting Google reCAPTCHA API:', error.message);

      throw new Error('Error al comunicarse con el servicio de reCAPTCHA.');
    }
  }
}

import dotenv from 'dotenv';
dotenv.config();
export const recaptchaService = new RecaptchaService(process.env.RECAPTCHA_SECRET_KEY || '');
