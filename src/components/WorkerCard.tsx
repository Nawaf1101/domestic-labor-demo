import {
  Card,
  CardBody,
  Avatar,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Box,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { Worker } from "../types";
import { useNavigate } from "react-router-dom";

interface WorkerCardProps {
  worker: Worker;
  showReserveButton?: boolean;
  onReserve?: (worker: Worker) => void;
}

export const WorkerCard = ({
  worker,
  showReserveButton = false,
  onReserve,
}: WorkerCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/customer/worker/${worker.id}`);
  };

  return (
    <Card
      maxW="sm"
      cursor="pointer"
      onClick={handleClick}
      overflow="hidden"
      position="relative"
      _hover={{
        shadow: "xl",
        transform: "translateY(-8px)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Box position="relative" p={6} bgGradient="linear(to-br, brand.50, gray.50)" display="flex" justifyContent="center" alignItems="center">
        <Avatar
          src={worker.imageUrl}
          name={worker.name}
          size="2xl"
          border="4px solid"
          borderColor="white"
          boxShadow="lg"
        />
        <Box
          position="absolute"
          top={3}
          right={3}
          bg="white"
          borderRadius="full"
          px={3}
          py={1}
          boxShadow="md"
        >
          <Text fontSize="xs" fontWeight="700" color="brand.500">
            {worker.salaryPerMonth} SAR
          </Text>
        </Box>
      </Box>
      <CardBody p={5}>
        <VStack align="stretch" spacing={3}>
          <Text fontWeight="800" fontSize="xl" color="gray.800">
            {worker.name}
          </Text>
          <HStack spacing={2} flexWrap="wrap">
            <Badge
              colorScheme="blue"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {worker.type}
            </Badge>
            <Badge
              colorScheme="green"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {worker.age} {t("worker.form.age")}
            </Badge>
            <Badge
              colorScheme="purple"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="600"
            >
              {worker.religion}
            </Badge>
          </HStack>
          <Flex justify="space-between" align="center" pt={2}>
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                {t("worker.form.salaryPerMonth")}
              </Text>
              <Text fontSize="lg" fontWeight="700" color="brand.500">
                {worker.salaryPerMonth} SAR
              </Text>
            </VStack>
            {worker.hasWorkedInGulf && (
              <Badge colorScheme="orange" px={2} py={1} borderRadius="md">
                Gulf Experience
              </Badge>
            )}
          </Flex>
          {showReserveButton && onReserve && (
            <Button
              colorScheme="brand"
              size="md"
              w="100%"
              mt={2}
              fontWeight="700"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onReserve(worker);
              }}
            >
              {t("customer.reserveWorker")}
            </Button>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

