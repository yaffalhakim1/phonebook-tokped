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

export type ContactResponse = {
  contact: Contact[];
};
