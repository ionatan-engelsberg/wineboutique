import { ObjectId } from '../../types/ObjectId';

// TODO
export const getAdminNewOrderHtml = (userId: ObjectId, orderId: ObjectId) => `NUEVA ORDEN:
\nUSER: ${userId}
\nORDER: ${orderId}`;
