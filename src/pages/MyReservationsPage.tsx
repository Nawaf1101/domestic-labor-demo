import {
  Box,
  Container,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { offices } from "../data/offices";

export const MyReservationsPage = () => {
  const { t } = useTranslation();
  const { currentUser, reservations, workers } = useAuth();

  const userReservations = reservations.filter(
    (r) => r.customerId === currentUser?.id
  );

  const getOfficeName = (officeId: string) => {
    const office = offices.find((o) => o.id === officeId);
    return office?.name || "Unknown";
  };

  const getReservationDetails = (reservation: typeof reservations[0]) => {
    const worker = workers.find((w) => w.id === reservation.workerId);
    return {
      workerName: worker?.name || "Unknown",
      officeName: getOfficeName(reservation.officeId),
      depositAmount: worker?.depositAmount || 0,
      fullPackagePrice: worker?.fullPackagePrice || 0,
    };
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 80px)" py={10} w="100%" overflowX="hidden">
      <Container maxW="1400px" w="100%">
        <VStack spacing={8} align="stretch">
          <VStack align="start" spacing={2}>
            <Heading
              fontSize="4xl"
              fontWeight="800"
              bgGradient="linear(to-r, brand.500, brand.600)"
              bgClip="text"
            >
              {t("customer.myReservations")}
            </Heading>
            <Text color="gray.600" fontSize="md">
              View and manage your reservations
            </Text>
          </VStack>

          {userReservations.length === 0 ? (
            <Box
              textAlign="center"
              py={20}
              bg="white"
              borderRadius="xl"
              boxShadow="soft"
              border="1px solid"
              borderColor="gray.100"
            >
              <Text fontSize="xl" color="gray.600" fontWeight="500">
                {t("customer.noReservations")}
              </Text>
            </Box>
          ) : (
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="soft"
              border="1px solid"
              borderColor="gray.100"
              overflow="hidden"
            >
              <TableContainer>
                <Table variant="modern">
              <Thead>
                <Tr>
                  <Th>{t("customer.workerName")}</Th>
                  <Th>{t("customer.officeName")}</Th>
                  <Th>{t("customer.reservedAt")}</Th>
                  <Th>{t("customer.depositAmount")}</Th>
                  <Th>{t("customer.fullPackagePrice")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userReservations.map((reservation) => {
                  const details = getReservationDetails(reservation);
                  return (
                    <Tr key={reservation.id}>
                      <Td>{details.workerName}</Td>
                      <Td>{details.officeName}</Td>
                      <Td>
                        {new Date(reservation.reservedAt).toLocaleDateString()}
                      </Td>
                      <Td>{details.depositAmount} SAR</Td>
                      <Td>{details.fullPackagePrice} SAR</Td>
                    </Tr>
                  );
                })}
                </Tbody>
              </Table>
            </TableContainer>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

