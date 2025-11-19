import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.05)"
      backdropFilter="blur(10px)"
      bgGradient="linear(to-r, white, gray.50)"
    >
      <Flex justify="space-between" align="center" maxW="1400px" mx="auto">
        <Text
          fontSize="2xl"
          fontWeight="800"
          bgGradient="linear(to-r, brand.500, brand.600)"
          bgClip="text"
          as={Link}
          to={currentUser ? (currentUser.role === "office" ? "/office/dashboard" : "/customer/offices") : "/login"}
          _hover={{
            transform: "scale(1.05)",
          }}
          transition="all 0.2s"
        >
          {t("common.appName")}
        </Text>

        <HStack spacing={3}>
          {currentUser && (
            <>
              {currentUser.role === "office" ? (
                <Button
                  as={Link}
                  to="/office/dashboard"
                  variant="ghost"
                  size="md"
                  fontWeight="600"
                  _hover={{
                    bg: "brand.50",
                    color: "brand.600",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                >
                  {t("nav.myWorkers")}
                </Button>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/customer/offices"
                    variant="ghost"
                    size="md"
                    fontWeight="600"
                    _hover={{
                      bg: "brand.50",
                      color: "brand.600",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    {t("nav.offices")}
                  </Button>
                  <Button
                    as={Link}
                    to="/customer/reservations"
                    variant="ghost"
                    size="md"
                    fontWeight="600"
                    _hover={{
                      bg: "brand.50",
                      color: "brand.600",
                      transform: "translateY(-2px)",
                    }}
                    transition="all 0.2s"
                  >
                    {t("nav.myReservations")}
                  </Button>
                </>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="md"
                colorScheme="red"
                fontWeight="600"
                _hover={{
                  bg: "red.50",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                {t("common.logout")}
              </Button>
            </>
          )}

          <Button
            onClick={toggleLanguage}
            size="md"
            variant="outline"
            colorScheme="brand"
            minW="70px"
            fontWeight="700"
            borderWidth="2px"
            _hover={{
              bg: "brand.500",
              color: "white",
              transform: "translateY(-2px)",
              boxShadow: "brand",
            }}
            transition="all 0.2s"
          >
            {i18n.language === "en" ? "AR" : "EN"}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

