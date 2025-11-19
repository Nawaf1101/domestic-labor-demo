import {
  Box,
  Container,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Button,
  Badge,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { offices } from "../data/offices";

export const WorkerDetailsPage = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workers, addReservationRequest, currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const worker = workers.find((w) => w.id === workerId);
  const office = worker ? offices.find((o) => o.id === worker.officeId) : null;

  if (!worker || !office) {
    return (
      <Container maxW="1200px" py={8}>
        <Text>Worker not found</Text>
      </Container>
    );
  }

  const handleReserve = () => {
    if (!currentUser || currentUser.role !== "customer") {
      navigate("/login");
      return;
    }

    onOpen();
  };

  const confirmReservation = () => {
    if (!currentUser || !worker) return;

    addReservationRequest({
      customerId: currentUser.id,
      workerId: worker.id,
      officeId: worker.officeId,
    });

    toast({
      title: t("customer.reservationRequestCreated"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
    navigate("/customer/reservations");
  };

  return (
    <Box bg="gray.900" minH="calc(100vh - 80px)" py={10} w="100%" overflowX="hidden">
      <Container maxW="1400px" w="100%">
        <VStack spacing={8} align="stretch">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            alignSelf="flex-start"
            size="lg"
            fontWeight="600"
            _hover={{
              bg: "brand.50",
              color: "brand.600",
            }}
          >
            ← {t("common.back")}
          </Button>

          <Box
            bg="gray.800"
            borderRadius="2xl"
            boxShadow="soft"
            border="1px solid"
            borderColor="gray.700"
            p={8}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Box
                borderRadius="xl"
                overflow="hidden"
                boxShadow="medium"
                border="1px solid"
                borderColor="gray.700"
                p={8}
                bgGradient="linear(to-br, brand.900, gray.800)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                minH="400px"
              >
                <Avatar
                  src={worker.imageUrl}
                  name={worker.name}
                  size="2xl"
                  border="6px solid"
                  borderColor="white"
                  boxShadow="xl"
                />
              </Box>

              <VStack align="stretch" spacing={6}>
                <VStack align="start" spacing={3}>
                  <Heading fontSize="3xl" fontWeight="800" color="gray.100">
                    {worker.name}
                  </Heading>

            <HStack spacing={2} flexWrap="wrap">
              <Badge colorScheme="blue" fontSize="md">
                {worker.type}
              </Badge>
              <Badge colorScheme="green" fontSize="md">
                {worker.age} {t("worker.form.age")}
              </Badge>
              <Badge colorScheme="purple" fontSize="md">
                {worker.religion}
              </Badge>
              <Badge colorScheme="orange" fontSize="md">
                {worker.sex === "male" ? t("worker.form.male") : t("worker.form.female")}
              </Badge>
            </HStack>

                  <Box
                    bg="gray.700"
                    p={6}
                    borderRadius="xl"
                    w="100%"
                    border="1px solid"
                    borderColor="gray.700"
                  >
                    <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">{t("customer.officeName")}:</Text>
                    <Text color="gray.100">{office.name}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">{t("worker.form.originCountry")}:</Text>
                    <Text color="gray.100">{worker.originCountry}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">{t("worker.form.experienceYears")}:</Text>
                    <Text color="gray.100">{worker.experienceYears}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">{t("office.hasWorkedInGulf")}:</Text>
                    <Text color="gray.100">
                      {worker.hasWorkedInGulf ? t("office.yes") : t("office.no")}
                    </Text>
                  </HStack>
                  {worker.hasWorkedInGulf && worker.previousGulfCountries && (
                    <HStack justify="space-between">
                      <Text fontWeight="bold" color="gray.200">
                        {t("worker.form.previousGulfCountries")}:
                      </Text>
                      <Text color="gray.100">{worker.previousGulfCountries}</Text>
                    </HStack>
                  )}
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">{t("worker.form.salaryPerMonth")}:</Text>
                    <Text color="gray.100">{worker.salaryPerMonth} SAR</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">
                      {t("worker.form.fullPackagePrice")}:
                    </Text>
                    <Text color="gray.100">{worker.fullPackagePrice} SAR</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontWeight="bold" color="gray.200">
                      {t("worker.form.depositAmount")}:
                    </Text>
                    <Text color="gray.100">{worker.depositAmount} SAR</Text>
                  </HStack>
                  </VStack>
                  </Box>
                </VStack>

            {worker.videoUrl && (
              <Box>
                <Heading size="md" mb={2} color="gray.100">
                  {t("worker.form.videoUrl")}
                </Heading>
                <Box
                  as="iframe"
                  src={worker.videoUrl}
                  width="100%"
                  height="315"
                  borderRadius="md"
                />
              </Box>
            )}

            <HStack spacing={4}>
              {worker.cvUrl && (
                <Button
                  as="a"
                  href={worker.cvUrl}
                  target="_blank"
                  variant="outline"
                  colorScheme="brand"
                >
                  {t("customer.downloadCV")}
                </Button>
              )}
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleReserve}
                flex={1}
              >
                {t("customer.reserveWorker")}
              </Button>
            </HStack>
              </VStack>
            </SimpleGrid>
          </Box>

          <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("customer.reservationRequestConfirm")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold" color="gray.200">{t("customer.workerName")}:</Text>
                <Text color="gray.100">{worker.name}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold" color="gray.200">{t("customer.officeName")}:</Text>
                <Text color="gray.100">{office.name}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold" color="gray.200">{t("customer.depositAmount")}:</Text>
                <Text color="gray.100">{worker.depositAmount} SAR</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="bold" color="gray.200">{t("customer.fullPackagePrice")}:</Text>
                <Text color="gray.100">{worker.fullPackagePrice} SAR</Text>
              </HStack>
              <HStack justify="space-between" pt={2} borderTop="1px" borderColor="gray.700">
                <Text fontWeight="bold" fontSize="lg" color="gray.100">{t("customer.total")}:</Text>
                <Text fontWeight="bold" fontSize="lg" color="gray.100">
                  {worker.fullPackagePrice} SAR
                </Text>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button colorScheme="brand" onClick={confirmReservation}>
              {t("customer.sendRequest")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </VStack>
      </Container>
    </Box>
  );
};

