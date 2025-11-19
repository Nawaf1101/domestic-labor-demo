import {
  Box,
  Container,
  VStack,
  HStack,
  Card,
  CardBody,
  Text,
  Button,
  Badge,
  Select,
  Heading,
  Avatar,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { offices } from "../data/offices";

export const OfficesListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"rating" | "reviews">("rating");

  const sortedOffices = [...offices].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      return b.numberOfReviews - a.numberOfReviews;
    }
  });

  return (
    <Box bg="gray.900" minH="calc(100vh - 80px)" py={10} w="100%" overflowX="hidden">
      <Container maxW="1400px" w="100%">
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Heading
                fontSize="4xl"
                fontWeight="800"
                bgGradient="linear(to-r, brand.500, brand.600)"
                bgClip="text"
              >
                {t("customer.officesList")}
              </Heading>
              <Text color="gray.300" fontSize="md">
                Choose from our trusted domestic labor offices
              </Text>
            </VStack>
            <Select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSortBy(e.target.value as "rating" | "reviews")
              }
              maxW="250px"
              size="lg"
              bg="gray.800"
              fontWeight="600"
            >
              <option value="rating">{t("customer.sortByRating")}</option>
              <option value="reviews">{t("customer.sortByReviews")}</option>
            </Select>
          </HStack>

          <Box
            display="grid"
            gridTemplateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {sortedOffices.map((office) => (
              <Card
                key={office.id}
                cursor="pointer"
                onClick={() => navigate(`/customer/office/${office.id}`)}
                bg="gray.800"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  bgGradient: "linear(to-r, brand.500, brand.600)",
                }}
              >
                <CardBody p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Flex align="center" gap={4}>
                      <Avatar
                        src={office.logoUrl}
                        name={office.name}
                        size="lg"
                        border="2px solid"
                        borderColor="brand.200"
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="xl" fontWeight="800" color="gray.100">
                          {office.name}
                        </Text>
                        <HStack spacing={3} mt={1}>
                          <Badge
                            colorScheme="yellow"
                            fontSize="sm"
                            px={2}
                            py={1}
                            borderRadius="md"
                            fontWeight="700"
                          >
                            ⭐ {office.rating}
                          </Badge>
                          <Text fontSize="xs" color="gray.300" fontWeight="500">
                            {office.numberOfReviews} {t("customer.reviews")}
                          </Text>
                        </HStack>
                      </VStack>
                    </Flex>
                    <Button
                      colorScheme="brand"
                      size="md"
                      w="100%"
                      fontWeight="700"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        navigate(`/customer/office/${office.id}`);
                      }}
                    >
                      {t("common.view") || "View Workers"}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

