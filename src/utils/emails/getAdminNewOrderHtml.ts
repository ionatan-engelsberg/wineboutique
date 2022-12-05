import { ObjectId } from '../../types/ObjectId';

export const getAdminNewOrderHtml = (userId: ObjectId, orderId: ObjectId) => `NUEVA ORDEN:
\nUSER: ${userId}
\nORDER: ${orderId}`;
