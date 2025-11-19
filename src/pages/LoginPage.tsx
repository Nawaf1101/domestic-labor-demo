import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (login(email, password)) {
      toast({
        title: t("auth.loginSuccess"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate("/");
      }, 100);
    } else {
      setError(t("auth.invalidCredentials"));
    }
  };

  return (
    <Box
      minH="calc(100vh - 80px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, gray.900, gray.800, gray.900)"
      py={12}
      px={4}
    >
      <Container maxW="md">
        <Box
          bg="gray.800"
          p={10}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <VStack spacing={8}>
            <VStack spacing={2}>
              <Heading
                fontSize="3xl"
                fontWeight="800"
                bgGradient="linear(to-r, brand.500, brand.600)"
                bgClip="text"
              >
                {t("auth.title")}
              </Heading>
              <Text color="gray.300" fontSize="sm">
                Welcome back! Please login to continue
              </Text>
            </VStack>
            <Box w="100%" as="form" onSubmit={handleSubmit}>
              <VStack spacing={5}>
                {error && (
                  <Alert
                    status="error"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="red.500"
                  >
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
                <FormControl isRequired>
                  <FormLabel fontWeight="600" mb={2}>
                    {t("common.email")}
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    placeholder="office1@gulfcare.com"
                    size="lg"
                    bg="gray.700"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="600" mb={2}>
                    {t("common.password")}
                  </FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    placeholder="office123"
                    size="lg"
                    bg="gray.700"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="brand"
                  w="100%"
                  size="lg"
                  fontSize="md"
                  fontWeight="700"
                  mt={4}
                >
                  {t("common.login")}
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

