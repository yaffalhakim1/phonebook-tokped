import {
  EDIT_CONTACT,
  EDIT_CONTACT_NUMBER,
  GET_CONTACT_DETAIL,
} from "@/resource/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import {
  EditContactVariables,
  EditPhoneNumberVariables,
  GetContactDetailData,
  GetContactDetailVars,
} from "@/types/contact_types";
import { checkUniqueness } from "@/resource/helper";

interface EditContactProps {
  contactId: number;
}
export default function EditContactUser({ contactId }: EditContactProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [phoneNumbers, setPhoneNumbers] = useState([""]);

  const handleChangePhoneNumber = (index: any, value: any) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const [
    getContactDetail,
    { called, loading: loadingedit, error: erroredit, data: dataedit },
  ] = useLazyQuery<GetContactDetailData, GetContactDetailVars>(
    GET_CONTACT_DETAIL
  );

  const [editContactMutation] = useMutation<EditContactVariables>(EDIT_CONTACT);
  const [editPhoneNumberMutation] =
    useMutation<EditPhoneNumberVariables>(EDIT_CONTACT_NUMBER);

  useEffect(() => {
    if (isOpen && contactId) {
      getContactDetail({ variables: { id: contactId } });
    }
  }, [isOpen, contactId, getContactDetail]);

  const contact = dataedit?.contact_by_pk;

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const first_name = formData.get("first_name")?.toString().trim();
    const last_name = formData.get("last_name")?.toString().trim();

    if (checkUniqueness(first_name!) || checkUniqueness(last_name!)) {
      toast({
        title: "Names should not contain special characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await editContactMutation({
        variables: {
          id: contact?.id,
          _set: {
            first_name: first_name,
            last_name: last_name,
          },
        },
      });

      contact?.phones.forEach(async (phone, index) => {
        const newNumber = formData.get(`phone${index}`) as string;
        if (newNumber && newNumber !== phone.number) {
          await editPhoneNumberMutation({
            variables: {
              pk_columns: {
                number: phone.number,
                contact_id: contact?.id,
              },
              new_phone_number: newNumber,
            },
          });
        }
      });
      toast({
        title: "Contact Edited",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Failed to edit contact:", error);
      return toast({
        title: "Failed to edit contact",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loadingedit) return <p>Adding contact...</p>;
  if (erroredit)
    return toast({
      title: "Failed to get data contact",
      status: "error",
      duration: 3000,
      isClosable: true,
    });

  return (
    <>
      <Box display="flex" as="button" onClick={onOpen}>
        <EditIcon mr="2" />
        Edit Contact
      </Box>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleFormSubmit}>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder={contact?.first_name}
                  name="first_name"
                  defaultValue={contact?.first_name}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Last name</FormLabel>
                <Input
                  placeholder={contact?.last_name}
                  defaultValue={contact?.last_name}
                  name="last_name"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Phone Numbers</FormLabel>
                {contact?.phones.map((phone, index) => (
                  <Input
                    key={index}
                    name={`phone${index}`}
                    placeholder={phone.number}
                    defaultValue={phone.number}
                    onChange={(e) =>
                      handleChangePhoneNumber(index, e.target.value)
                    }
                  />
                ))}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" colorScheme="green" mr={3}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
