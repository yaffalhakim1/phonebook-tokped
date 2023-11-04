import { ADD_CONTACT_WITH_PHONES } from "@/resource/queries";
import { gql, useMutation } from "@apollo/client";
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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";

export default function AddContact() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [phoneNumbers, setPhoneNumbers] = useState([""]);

  const addPhoneNumberFields = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleChangePhoneNumber = (index: any, value: any) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const [addContactWithPhones, { data, loading, error }] = useMutation(
    ADD_CONTACT_WITH_PHONES
  );

  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const first_name = formData.get("first_name");
    const last_name = formData.get("last_name");
    // const phones = formData.getAll("phone");

    try {
      await addContactWithPhones({
        variables: {
          first_name,
          last_name,
          phones: phoneNumbers.map((number) => ({
            number,
          })),
        },
      });

      toast({
        title: "Added to contact",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      throw new Error("failed adding to contact", error);

      // Handle the error
    }
  };

  if (loading) return <p>Adding contact...</p>;
  if (error)
    return toast({
      title: "Failed to add contact",
      description: `${error.message}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    });

  return (
    <>
      <Button onClick={onOpen} size="sm" colorScheme="teal">
        Add Contact
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="First name"
                  name="first_name"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Last name</FormLabel>
                <Input placeholder="Last name" name="last_name" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Phone Numbers</FormLabel>
                {phoneNumbers.map((number, index) => (
                  <Input
                    key={index}
                    name="phone"
                    placeholder="Phone Number"
                    onChange={(e) =>
                      handleChangePhoneNumber(index, e.target.value)
                    }
                    value={number}
                  />
                ))}
                <Button
                  onClick={addPhoneNumberFields}
                  colorScheme="blue"
                  mt={4}
                >
                  {" "}
                  Add more number{" "}
                </Button>
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
