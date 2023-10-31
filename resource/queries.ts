import { gql } from "@apollo/client";

export const GET_CONTACT = gql`
  query GetContacts($offset: Int, $limit: Int) {
    contact(offset: $offset, limit: $limit) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`;
