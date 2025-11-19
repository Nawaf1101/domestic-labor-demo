import {
  Box,
  Container,
  VStack,
  Heading,
  Select,
  Input,
  Button,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { offices } from "../data/offices";
import { WorkerCard } from "../components/WorkerCard";
import type { Worker } from "../types";

export const OfficeWorkersPage = () => {
  const { officeId } = useParams<{ officeId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workers, currentUser } = useAuth();

  const [filters, setFilters] = useState({
    religion: "",
    minAge: "",
    maxAge: "",
    type: "",
    hasWorkedInGulf: "all",
  });

  const office = offices.find((o) => o.id === officeId);
  const officeWorkers = workers.filter((w) => w.officeId === officeId);

  const filteredWorkers = useMemo(() => {
    return officeWorkers.filter((worker) => {
      if (filters.religion && worker.religion !== filters.religion) {
        return false;
      }
      if (filters.minAge && worker.age < parseInt(filters.minAge)) {
        return false;
      }
      if (filters.maxAge && worker.age > parseInt(filters.maxAge)) {
        return false;
      }
      if (filters.type && worker.type !== filters.type) {
        return false;
      }
      if (filters.hasWorkedInGulf === "yes" && !worker.hasWorkedInGulf) {
        return false;
      }
      if (filters.hasWorkedInGulf === "no" && worker.hasWorkedInGulf) {
        return false;
      }
      return true;
    });
  }, [officeWorkers, filters]);

  const uniqueReligions = useMemo(() => {
    return Array.from(new Set(officeWorkers.map((w) => w.religion)));
  }, [officeWorkers]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(officeWorkers.map((w) => w.type)));
  }, [officeWorkers]);

  const handleReserve = (worker: Worker) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate(`/customer/worker/${worker.id}`);
  };

  const clearFilters = () => {
    setFilters({
      religion: "",
      minAge: "",
      maxAge: "",
      type: "",
      hasWorkedInGulf: "all",
    });
  };

  if (!office) {
    return (
      <Container maxW="1200px" py={8}>
        <Text>Office not found</Text>
      </Container>
    );
  }

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
              {t("customer.workersForOffice", { officeName: office.name })}
            </Heading>
            <Text color="gray.600" fontSize="md">
              Browse and filter available workers
            </Text>
          </VStack>

          <Box
            p={6}
            borderWidth="1px"
            borderRadius="xl"
            bg="white"
            boxShadow="soft"
            borderColor="gray.100"
          >
            <VStack spacing={5} align="stretch">
              <Heading size="lg" fontWeight="700" color="gray.800">
                {t("customer.filters")}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
              <Select
                placeholder={t("customer.filterByReligion")}
                value={filters.religion}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, religion: e.target.value })
                }
              >
                {uniqueReligions.map((religion) => (
                  <option key={religion} value={religion}>
                    {religion}
                  </option>
                ))}
              </Select>

              <Input
                placeholder={t("customer.minAge")}
                type="number"
                value={filters.minAge}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, minAge: e.target.value })
                }
              />

              <Input
                placeholder={t("customer.maxAge")}
                type="number"
                value={filters.maxAge}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFilters({ ...filters, maxAge: e.target.value })
                }
              />

              <Select
                placeholder={t("customer.filterByType")}
                value={filters.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.hasWorkedInGulf}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, hasWorkedInGulf: e.target.value })
                }
              >
                <option value="all">{t("customer.all")}</option>
                <option value="yes">{t("office.yes")}</option>
                <option value="no">{t("office.no")}</option>
              </Select>
              </SimpleGrid>
              <Button
                onClick={clearFilters}
                size="md"
                variant="outline"
                colorScheme="brand"
                fontWeight="700"
                borderWidth="2px"
                maxW="200px"
              >
                {t("common.clear")}
              </Button>
            </VStack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredWorkers.length === 0 ? (
            <Box gridColumn="1 / -1" textAlign="center" py={8}>
              <Text>{t("common.noData")}</Text>
            </Box>
          ) : (
            filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                showReserveButton={true}
                onReserve={handleReserve}
              />
            ))
          )}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

