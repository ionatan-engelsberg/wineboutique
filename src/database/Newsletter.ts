import { Schema, model } from 'mongoose';

import { Newsletter } from '../interfaces';

export const NewsletterSchema = new Schema<Newsletter>(
  {
    emails: {
      type: [String],
      default: []
    }
  },
  { versionKey: false }
);

export const NewsletterModel = model<Newsletter>('Newsletter', NewsletterSchema);
