type Phone = {
  number: string;
};

type Contact = {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: Phone[];
};

export type GetContactDetailData = {
  contact_by_pk: Contact;
};

// Define the structure of the variables required to run the query
export type GetContactDetailVars = {
  id: number;
};

export type ContactResponse = {
  contact: Contact[];
};

export type DeleteContactResponse = {
  delete_contact_by_pk: {
    first_name: string;
    last_name: string;
    id: number;
  };
};

// TypeScript interfaces/types for the GraphQL operations
export type ContactSetInput = {
  first_name?: string;
  last_name?: string;
  // Add other contact fields as needed
};

export type PhonePkColumnsInput = {
  number: string;
  contact_id: number;
};

export type EditContactVariables = {
  id: number;
  _set: ContactSetInput;
};

export type EditPhoneNumberVariables = {
  pk_columns: PhonePkColumnsInput;
  new_phone_number: string;
};
