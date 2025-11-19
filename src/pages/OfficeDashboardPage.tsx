import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Text,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import type { Worker } from "../types";
import { WorkerFormModal } from "../components/WorkerFormModal";
import { CSVImportModal } from "../components/CSVImportModal";
import { offices } from "../data/offices";

export const OfficeDashboardPage = () => {
  const { t } = useTranslation();
  const { currentUser, workers, deleteWorker, reservationRequests, updateReservationRequestStatus } = useAuth();
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);

  // Get current office
  const currentOffice = offices.find((o) => o.id === currentUser?.officeId);

  // Filter workers for current office
  const officeWorkers = workers.filter(
    (worker) => worker.officeId === currentUser?.officeId
  );

  // Filter reservation requests for current office
  const officeRequests = reservationRequests.filter(
    (r) => r.officeId === currentUser?.officeId
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const approvedRequests = officeRequests.filter(
      (r) => r.status === "approved"
    );

    const totalRevenue = approvedRequests.reduce((sum, request) => {
      const worker = workers.find((w) => w.id === request.workerId);
      return sum + (worker?.fullPackagePrice || 0);
    }, 0);

    const totalFees = approvedRequests.reduce((sum, request) => {
      const worker = workers.find((w) => w.id === request.workerId);
      const packagePrice = worker?.fullPackagePrice || 0;
      const deposit = worker?.depositAmount || 0;
      // Fees = package price - deposit (assuming deposit goes to worker)
      return sum + (packagePrice - deposit);
    }, 0);

    const pendingRequests = officeRequests.filter((r) => r.status === "pending").length;

    return {
      totalWorkers: officeWorkers.length,
      successfulDeals: approvedRequests.length,
      totalRevenue,
      totalFees,
      pendingRequests,
    };
  }, [officeRequests, workers, officeWorkers]);

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

  const handleApprove = (requestId: string) => {
    updateReservationRequestStatus(requestId, "approved");
    toast({
      title: t("office.requestApproved"),
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleReject = (requestId: string) => {
    updateReservationRequestStatus(requestId, "rejected");
    toast({
      title: t("office.requestRejected"),
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isCSVOpen,
    onOpen: onCSVOpen,
    onClose: onCSVClose,
  } = useDisclosure();
  const cancelRef = useRef<any>(null);
  const toast = useToast();

  const handleEdit = (worker: Worker) => {
    setSelectedWorker(worker);
    onFormOpen();
  };

  const handleDelete = (worker: Worker) => {
    setWorkerToDelete(worker);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    if (workerToDelete) {
      deleteWorker(workerToDelete.id);
      toast({
        title: t("office.workerDeleted"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setWorkerToDelete(null);
      onDeleteClose();
    }
  };

  const handleAddNew = () => {
    setSelectedWorker(null);
    onFormOpen();
  };

  return (
    <Box bg="gray.50" minH="calc(100vh - 80px)" py={10} w="100%" overflowX="hidden">
      <Container maxW="1400px" w="100%">
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <HStack spacing={4}>
              {currentOffice?.logoUrl && (
                <Avatar
                  src={currentOffice.logoUrl}
                  name={currentOffice.name}
                  size="xl"
                  border="3px solid"
                  borderColor="brand.200"
                />
              )}
              <VStack align="start" spacing={1}>
                <Text
                  fontSize="4xl"
                  fontWeight="800"
                  bgGradient="linear(to-r, brand.500, brand.600)"
                  bgClip="text"
                >
                  {currentOffice?.name || t("office.dashboard")}
                </Text>
                <Text color="gray.600" fontSize="md">
                  Manage your workers and track your business
                </Text>
              </VStack>
            </HStack>
            <HStack spacing={3}>
              <Button
                onClick={onCSVOpen}
                variant="outline"
                colorScheme="brand"
                size="lg"
                fontWeight="700"
                borderWidth="2px"
              >
                {t("office.importFromCSV")}
              </Button>
              <Button
                onClick={handleAddNew}
                colorScheme="brand"
                size="lg"
                fontWeight="700"
              >
                {t("office.addWorker")}
              </Button>
            </HStack>
          </Flex>

          {/* Statistics Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
            <Card bg="white" boxShadow="soft" border="1px solid" borderColor="gray.100">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600" fontWeight="600">
                    Total Workers
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="brand.500" fontWeight="800">
                    {stats.totalWorkers}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Active listings
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="white" boxShadow="soft" border="1px solid" borderColor="gray.100">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600" fontWeight="600">
                    Successful Deals
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="green.500" fontWeight="800">
                    {stats.successfulDeals}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Completed reservations
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="white" boxShadow="soft" border="1px solid" borderColor="gray.100">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600" fontWeight="600">
                    Total Revenue
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="blue.500" fontWeight="800">
                    {stats.totalRevenue.toLocaleString()} SAR
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    All-time earnings
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="white" boxShadow="soft" border="1px solid" borderColor="gray.100">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600" fontWeight="600">
                    Total Fees Earned
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="purple.500" fontWeight="800">
                    {stats.totalFees.toLocaleString()} SAR
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Service fees
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg="white" boxShadow="soft" border="1px solid" borderColor="gray.100">
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.600" fontWeight="600">
                    Pending Requests
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="yellow.500" fontWeight="800">
                    {stats.pendingRequests}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Awaiting review
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Reservation Requests Table */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="soft"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
          >
            <Box p={6} borderBottom="1px solid" borderColor="gray.100">
              <Text fontSize="xl" fontWeight="700" color="gray.800">
                {t("office.reservationRequests")}
              </Text>
            </Box>
            <TableContainer>
              <Table variant="modern">
                <Thead>
                  <Tr>
                    <Th>{t("customer.workerName")}</Th>
                    <Th>{t("customer.requestedAt")}</Th>
                    <Th>{t("customer.statusLabel")}</Th>
                    <Th>{t("customer.fullPackagePrice")}</Th>
                    <Th>{t("common.actions")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {officeRequests.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={10}>
                        <Text color="gray.500">{t("office.noReservationRequests")}</Text>
                      </Td>
                    </Tr>
                  ) : (
                    officeRequests.map((request) => {
                      const worker = workers.find((w) => w.id === request.workerId);
                      return (
                        <Tr key={request.id}>
                          <Td>
                            <HStack spacing={3}>
                              <Avatar
                                src={worker?.imageUrl}
                                name={worker?.name}
                                size="sm"
                                border="2px solid"
                                borderColor="brand.200"
                              />
                              <Text fontWeight="600">{worker?.name || "Unknown"}</Text>
                            </HStack>
                          </Td>
                          <Td>
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(request.status)} px={2} py={1} borderRadius="md">
                              {t(`customer.status.${request.status}`)}
                            </Badge>
                          </Td>
                          <Td fontWeight="600">{worker?.fullPackagePrice || 0} SAR</Td>
                          <Td>
                            {request.status === "pending" && (
                              <HStack spacing={2}>
                                <Button
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => handleApprove(request.id)}
                                >
                                  {t("office.approve")}
                                </Button>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={() => handleReject(request.id)}
                                >
                                  {t("office.reject")}
                                </Button>
                              </HStack>
                            )}
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          {/* Workers Table */}
          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="soft"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
          >
            <Box p={6} borderBottom="1px solid" borderColor="gray.100">
              <Text fontSize="xl" fontWeight="700" color="gray.800">
                {t("office.workersList")}
              </Text>
            </Box>
            <TableContainer>
              <Table variant="modern">
                <Thead>
                  <Tr>
                    <Th>{t("office.name")}</Th>
                    <Th>{t("office.type")}</Th>
                    <Th>{t("office.age")}</Th>
                    <Th>{t("office.salaryPerMonth")}</Th>
                    <Th>{t("office.hasWorkedInGulf")}</Th>
                    <Th>{t("common.edit")}</Th>
                    <Th>{t("common.delete")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {officeWorkers.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" py={10}>
                        <Text color="gray.500">{t("common.noData")}</Text>
                      </Td>
                    </Tr>
                  ) : (
                    officeWorkers.map((worker) => (
                      <Tr key={worker.id}>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar
                              src={worker.imageUrl}
                              name={worker.name}
                              size="sm"
                              border="2px solid"
                              borderColor="brand.200"
                            />
                            <Text fontWeight="600">{worker.name}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge colorScheme="blue" px={2} py={1} borderRadius="md">
                            {worker.type}
                          </Badge>
                        </Td>
                        <Td>{worker.age}</Td>
                        <Td fontWeight="600">{worker.salaryPerMonth} SAR</Td>
                        <Td>
                          <Badge
                            colorScheme={worker.hasWorkedInGulf ? "green" : "gray"}
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {worker.hasWorkedInGulf ? t("office.yes") : t("office.no")}
                          </Badge>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="brand"
                            onClick={() => handleEdit(worker)}
                          >
                            {t("common.edit")}
                          </Button>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDelete(worker)}
                          >
                            {t("common.delete")}
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

        <WorkerFormModal
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setSelectedWorker(null);
          }}
          worker={selectedWorker}
        />

        <CSVImportModal isOpen={isCSVOpen} onClose={onCSVClose} />

        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {t("common.delete")}
              </AlertDialogHeader>
              <AlertDialogBody>
                {t("office.deleteWorkerConfirm")}
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  {t("common.cancel")}
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  {t("common.delete")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        </VStack>
      </Container>
    </Box>
  );
};

