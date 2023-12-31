import Head from "next/head";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useQuery, useMutation } from "@apollo/client";
import { ContactResponse, DeleteContactResponse } from "@/types/contact_types";
import { DELETE_CONTACT, GET_CONTACT } from "@/resource/queries";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Tag,
} from "@chakra-ui/react";
import AddContact from "./contacts/addcontact";
import { StarIcon, DeleteIcon, ChevronDownIcon } from "@chakra-ui/icons";
import EditContactUser from "./contacts/editcontact";
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function Home() {
  const { getFavoritesFromStorage, addToFavoritesStorage } = useLocalStorage();
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  const { loading, error, data } = useQuery<ContactResponse>(GET_CONTACT, {
    variables: {
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      where: searchQuery ? { first_name: { _ilike: `%${searchQuery}%` } } : {},
    },
  });

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const [deleteContact, { loading: deleteLoading, error: deleteError }] =
    useMutation<DeleteContactResponse>(DELETE_CONTACT);

  const handleDelete = async (contactId: number) => {
    try {
      const response = await deleteContact({ variables: { id: contactId } });
      const deleted = response?.data?.delete_contact_by_pk;
      if (deleted) {
        toast({
          title: "Deleted from contact",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.reload();
      } else {
        toast({
          title: "Failed to deleting contact",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      throw new Error("Error occurred while deleting contact.");
    }
  };

  if (loading)
    return (
      <Center>
        <Text>Loading...</Text>
      </Center>
    );
  if (error) return <p>Error : {error.message}</p>;
  if (deleteLoading)
    return (
      <Center>
        <Text>Deleting...</Text>
      </Center>
    );
  if (deleteError) return <p>Error deleteing </p>;

  const favorites = getFavoritesFromStorage();
  const favContacts = data?.contact.filter((contact) =>
    favorites.includes(contact.id)
  );
  const regContacts = data?.contact.filter(
    (contact) => !favorites.includes(contact.id)
  );

  return (
    <>
      <Head>
        <title>Phonebook</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.sm">
        <Flex
          minWidth="max-content"
          alignItems="center"
          gap="2"
          p="2"
          mt={4}
          ml={6}
        >
          <Box>
            <Heading size="md">Phonebook</Heading>
          </Box>
          <Spacer />
          <AddContact />
        </Flex>
        <Flex>
          <Input
            mt={5}
            ml={6}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
          />
          <Button
            colorScheme="teal"
            size="md"
            ml={3}
            mt={5}
            onClick={() => {
              setSearchQuery(searchQuery);
            }}
          >
            Search
          </Button>
        </Flex>

        <main className={jakarta.className}>
          <div>
            <Text
              ml="6"
              mt="4"
              fontSize="md"
              color="gray.600"
              fontWeight="semibold"
            >
              Favorites
            </Text>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Phone Number</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {favContacts?.map((contact) => (
                    <Tr key={contact.id}>
                      <Td>{contact.first_name}</Td>
                      <Td>
                        {contact.phones.map((phone, index: number) => (
                          <div key={index}>{phone.number}</div>
                        ))}
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            size="sm"
                            rightIcon={<ChevronDownIcon />}
                          >
                            Options
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<StarIcon />}
                              onClick={() => addToFavoritesStorage(contact.id)}
                            >
                              Add to Fav
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleDelete(contact.id)}
                              icon={<DeleteIcon />}
                            >
                              Delete Contact
                            </MenuItem>
                            <MenuItem>
                              <EditContactUser contactId={contact.id} />
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                  <Text
                    ml="6"
                    mt="6"
                    fontSize="md"
                    color="gray.600"
                    fontWeight="semibold"
                  >
                    Contacts
                  </Text>
                  {regContacts?.map((contact) => (
                    <Tr key={contact.id}>
                      <Td>{contact.first_name}</Td>
                      <Td>
                        {contact.phones.map((phone, index: number) => (
                          <div key={index}>{phone.number}</div>
                        ))}
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            size="sm"
                            rightIcon={<ChevronDownIcon />}
                          >
                            Options
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<StarIcon />}
                              onClick={() => addToFavoritesStorage(contact.id)}
                            >
                              Add to Fav
                            </MenuItem>
                            <MenuItem
                              onClick={() => handleDelete(contact.id)}
                              icon={<DeleteIcon />}
                            >
                              Delete Contact
                            </MenuItem>
                            <MenuItem>
                              <EditContactUser contactId={contact.id} />
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Center>
              <ButtonGroup mt={3} mb={8}>
                <Box
                  as={Button}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Box>
                <Box as={Button} onClick={() => goToPage(currentPage + 1)}>
                  Next
                </Box>
              </ButtonGroup>
            </Center>
          </div>
        </main>
      </Container>
    </>
  );
}
