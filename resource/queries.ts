import { gql } from "@apollo/client";
// import { gql } from "@/__generated__";

export const GET_CONTACT = gql`
  query GetContacts($offset: Int, $limit: Int, $where: contact_bool_exp) {
    contact(offset: $offset, limit: $limit, where: $where) {
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

export const GET_CONTACT_DETAIL = gql`
  query GetContactDetail($id: Int!) {
    contact_by_pk(id: $id) {
      id
      first_name
      last_name
      created_at
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

export const ADD_CONTACT_WITH_PHONES = gql`
  mutation AddContactWithPhones(
    $first_name: String!
    $last_name: String!
    $phones: [phone_insert_input!]!
  ) {
    insert_contact(
      objects: {
        first_name: $first_name
        last_name: $last_name
        phones: { data: $phones }
      }
    ) {
      returning {
        first_name
        last_name
        id
        phones {
          number
        }
      }
    }
  }
`;

export const EDIT_CONTACT = gql`
  mutation EditContactById($id: Int!, $_set: contact_set_input!) {
    update_contact_by_pk(pk_columns: { id: $id }, _set: $_set) {
      id
      first_name
      last_name
    }
  }
`;

export const EDIT_CONTACT_NUMBER = gql`
  mutation EditPhoneNumber(
    $pk_columns: phone_pk_columns_input!
    $new_phone_number: String!
  ) {
    update_phone_by_pk(
      pk_columns: $pk_columns
      _set: { number: $new_phone_number }
    ) {
      contact {
        id
        last_name
        first_name
        # Include other fields if necessary
        phones {
          number
        }
      }
    }
  }
`;
