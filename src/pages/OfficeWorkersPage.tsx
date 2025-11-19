import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  SimpleGrid,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
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

  const menuButtonStyles = {
    bg: "gray.700",
    color: "gray.100",
    borderColor: "gray.600",
    _hover: { bg: "gray.700", borderColor: "gray.500" },
    _active: { bg: "gray.700" },
    _expanded: {
      borderColor: "brand.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
    },
  };

  const religionLabel =
    filters.religion || t("customer.filterByReligion");

  const typeLabel =
    filters.type || t("customer.filterByType");

  const hasWorkedInGulfLabel =
    filters.hasWorkedInGulf === "yes"
      ? t("office.yes")
      : filters.hasWorkedInGulf === "no"
      ? t("office.no")
      : t("customer.all");

  return (
    <Box bg="gray.900" minH="calc(100vh - 80px)" py={10} w="100%" overflowX="hidden">
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
            <Text color="gray.300" fontSize="md">
              Browse and filter available workers
            </Text>
          </VStack>

          <Box
            p={6}
            borderWidth="1px"
            borderRadius="xl"
            bg="gray.800"
            boxShadow="soft"
            borderColor="gray.700"
          >
            <VStack spacing={5} align="stretch">
              <Heading size="lg" fontWeight="700" color="gray.100">
                {t("customer.filters")}
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
                {/* Religion */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w="100%"
                    justifyContent="space-between"
                    {...menuButtonStyles}
                  >
                    {religionLabel}
                  </MenuButton>
                  <MenuList bg="gray.800" borderColor="gray.700">
                    {uniqueReligions.map((religion) => (
                      <MenuItem
                        key={religion}
                        bg="gray.800"
                        _hover={{ bg: "gray.700" }}
                        _focus={{ bg: "gray.700" }}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, religion }))
                        }
                      >
                        {religion}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

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

                {/* Type */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w="100%"
                    justifyContent="space-between"
                    {...menuButtonStyles}
                  >
                    {typeLabel}
                  </MenuButton>
                  <MenuList bg="gray.800" borderColor="gray.700">
                    {uniqueTypes.map((type) => (
                      <MenuItem
                        key={type}
                        bg="gray.800"
                        _hover={{ bg: "gray.700" }}
                        _focus={{ bg: "gray.700" }}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, type }))
                        }
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

                {/* Has worked in Gulf */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w="100%"
                    justifyContent="space-between"
                    {...menuButtonStyles}
                  >
                    {hasWorkedInGulfLabel}
                  </MenuButton>
                  <MenuList bg="gray.800" borderColor="gray.700">
                    <MenuItem
                      bg="gray.800"
                      _hover={{ bg: "gray.700" }}
                      _focus={{ bg: "gray.700" }}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, hasWorkedInGulf: "all" }))
                      }
                    >
                      {t("customer.all")}
                    </MenuItem>
                    <MenuItem
                      bg="gray.800"
                      _hover={{ bg: "gray.700" }}
                      _focus={{ bg: "gray.700" }}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, hasWorkedInGulf: "yes" }))
                      }
                    >
                      {t("office.yes")}
                    </MenuItem>
                    <MenuItem
                      bg="gray.800"
                      _hover={{ bg: "gray.700" }}
                      _focus={{ bg: "gray.700" }}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, hasWorkedInGulf: "no" }))
                      }
                    >
                      {t("office.no")}
                    </MenuItem>
                  </MenuList>
                </Menu>
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
