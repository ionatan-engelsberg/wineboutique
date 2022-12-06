import { ObjectId } from '../../types/ObjectId';

// TODO
export const getContactMessageHtml = (
  email: string,
  firstName: string,
  lastName: string,
  message: string
) => `
Datos de contacto:\n
Nombre: ${firstName}\n
Appellido: ${lastName}\n
Email: ${email}\n
\n
Mensaje: \n
${message}`;
