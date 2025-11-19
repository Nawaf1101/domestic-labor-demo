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
  Badge,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { offices } from "../data/offices";

export const MyReservationsPage = () => {
  const { t } = useTranslation();
  const { currentUser, reservationRequests, workers, cancelReservationRequest } = useAuth();
  const toast = useToast();

  const userRequests = reservationRequests.filter(
    (r) => r.customerId === currentUser?.id
  );

  const getOfficeName = (officeId: string) => {
    const office = offices.find((o) => o.id === officeId);
    return office?.name || "Unknown";
  };

  const getRequestDetails = (request: typeof reservationRequests[0]) => {
    const worker = workers.find((w) => w.id === request.workerId);
    return {
      workerName: worker?.name || "Unknown",
      officeName: getOfficeName(request.officeId),
      depositAmount: worker?.depositAmount || 0,
      fullPackagePrice: worker?.fullPackagePrice || 0,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "cancelled":
        return "gray";
      default:
        return "gray";
    }
  };

  const handleCancel = (requestId: string) => {
    cancelReservationRequest(requestId);
    toast({
      title: t("customer.requestCancelled"),
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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
              View and manage your reservation requests
            </Text>
          </VStack>

          {userRequests.length === 0 ? (
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
                  <Th>{t("customer.requestedAt")}</Th>
                  <Th>{t("customer.statusLabel")}</Th>
                  <Th>{t("customer.depositAmount")}</Th>
                  <Th>{t("customer.fullPackagePrice")}</Th>
                  <Th>{t("common.actions")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userRequests.map((request) => {
                  const details = getRequestDetails(request);
                  return (
                    <Tr key={request.id}>
                      <Td>{details.workerName}</Td>
                      <Td>{details.officeName}</Td>
                      <Td>
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(request.status)} px={2} py={1} borderRadius="md">
                          {t(`customer.status.${request.status}`)}
                        </Badge>
                      </Td>
                      <Td>{details.depositAmount} SAR</Td>
                      <Td>{details.fullPackagePrice} SAR</Td>
                      <Td>
                        {request.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            onClick={() => handleCancel(request.id)}
                          >
                            {t("customer.cancelRequest")}
                          </Button>
                        )}
                      </Td>
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

