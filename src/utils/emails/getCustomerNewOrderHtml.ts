import { ObjectId } from '../../types/ObjectId';

// TODO
export const getCustomerNewOrderHtml = (
  userId: ObjectId,
  userEmail: string,
  orderId: ObjectId
) => `NUEVA ORDEN:
\nUSER: ${userId} - ${userEmail}
\nORDER: ${orderId}`;
