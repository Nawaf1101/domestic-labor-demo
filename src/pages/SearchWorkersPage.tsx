import {
  Box,
  Container,
  VStack,
  Heading,
  Input,
  Button,
  SimpleGrid,
  Text,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { offices } from "../data/offices";
import { WorkerCard } from "../components/WorkerCard";
import type { Worker } from "../types";

export const SearchWorkersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { workers, currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    officeId: "",
    religion: "",
    minAge: "",
    maxAge: "",
    type: "",
    hasWorkedInGulf: "all",
    minSalary: "",
    maxSalary: "",
  });

  // Get all unique values for filters
  const uniqueReligions = useMemo(() => {
    return Array.from(new Set(workers.map((w) => w.religion))).sort();
  }, [workers]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(workers.map((w) => w.type))).sort();
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      // Text search by name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!worker.name.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Office filter
      if (filters.officeId && worker.officeId !== filters.officeId) {
        return false;
      }

      // Religion filter
      if (filters.religion && worker.religion !== filters.religion) {
        return false;
      }

      // Age filters
      if (filters.minAge && worker.age < parseInt(filters.minAge)) {
        return false;
      }
      if (filters.maxAge && worker.age > parseInt(filters.maxAge)) {
        return false;
      }

      // Type filter
      if (filters.type && worker.type !== filters.type) {
        return false;
      }

      // Gulf experience filter
      if (filters.hasWorkedInGulf === "yes" && !worker.hasWorkedInGulf) {
        return false;
      }
      if (filters.hasWorkedInGulf === "no" && worker.hasWorkedInGulf) {
        return false;
      }

      // Salary filters
      if (filters.minSalary && worker.salaryPerMonth < parseInt(filters.minSalary)) {
        return false;
      }
      if (filters.maxSalary && worker.salaryPerMonth > parseInt(filters.maxSalary)) {
        return false;
      }

      return true;
    });
  }, [workers, searchQuery, filters]);

  const handleReserve = (worker: Worker) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    navigate(`/customer/worker/${worker.id}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      officeId: "",
      religion: "",
      minAge: "",
      maxAge: "",
      type: "",
      hasWorkedInGulf: "all",
      minSalary: "",
      maxSalary: "",
    });
  };

  const getOfficeName = (officeId: string) => {
    const office = offices.find((o) => o.id === officeId);
    return office?.name || "Unknown Office";
  };

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

  const officeLabel = filters.officeId
    ? getOfficeName(filters.officeId)
    : t("customer.filterByOffice");

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
              {t("customer.searchWorkers")}
            </Heading>
            <Text color="gray.300" fontSize="md">
              {t("customer.searchWorkersDescription")}
            </Text>
          </VStack>

          {/* Search and Filters */}
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
                {t("customer.searchAndFilters")}
              </Heading>

              {/* Search Input */}
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder={t("customer.searchByName")}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  bg="gray.700"
                />
              </InputGroup>

              {/* Filters Grid */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {/* Office */}
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w="100%"
                    justifyContent="space-between"
                    {...menuButtonStyles}
                  >
                    {officeLabel}
                  </MenuButton>
                  <MenuList bg="gray.800" borderColor="gray.700">
                    {offices.map((office) => (
                      <MenuItem
                        key={office.id}
                        bg="gray.800"
                        _hover={{ bg: "gray.700" }}
                        _focus={{ bg: "gray.700" }}
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, officeId: office.id }))
                        }
                      >
                        {office.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

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

                <Input
                  placeholder={t("customer.minSalary")}
                  type="number"
                  value={filters.minSalary}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters({ ...filters, minSalary: e.target.value })
                  }
                />

                <Input
                  placeholder={t("customer.maxSalary")}
                  type="number"
                  value={filters.maxSalary}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFilters({ ...filters, maxSalary: e.target.value })
                  }
                />
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

          {/* Results Count */}
          <Box>
            <Text color="gray.300" fontSize="sm" fontWeight="600">
              {t("customer.resultsCount", { count: filteredWorkers.length })}
            </Text>
          </Box>

          {/* Workers Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredWorkers.length === 0 ? (
              <Box gridColumn="1 / -1" textAlign="center" py={12}>
                <Text fontSize="lg" color="gray.400" fontWeight="500">
                  {t("customer.noWorkersFound")}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {t("customer.tryDifferentFilters")}
                </Text>
              </Box>
            ) : (
              filteredWorkers.map((worker) => (
                <WorkerCard
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
