import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Papa from "papaparse";
import type { Worker, WorkerType, WorkerSex } from "../types";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CSVImportModal = ({ isOpen, onClose }: CSVImportModalProps) => {
  const { t } = useTranslation();
  const { currentUser, importWorkers } = useAuth();
  const toast = useToast();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file || !currentUser?.officeId) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<unknown>) => {
        try {
          const workers: Omit<Worker, "id">[] = results.data.map((row: unknown) => {
            const r = row as Record<string, string>;
            return {
            officeId: currentUser.officeId!,
            name: r.name || "",
            imageUrl: r.imageUrl || "https://via.placeholder.com/300x400",
            videoUrl: r.videoUrl || "",
            cvUrl: r.cvUrl || "",
            salaryPerMonth: parseFloat(r.salaryPerMonth) || 0,
            sex: (r.sex || "female") as WorkerSex,
            age: parseInt(r.age) || 0,
            originCountry: r.originCountry || "",
            religion: r.religion || "",
            type: (r.type || "housekeeper") as WorkerType,
            experienceYears: parseInt(r.experienceYears) || 0,
            hasWorkedInGulf: r.hasWorkedInGulf === "true" || r.hasWorkedInGulf === "yes",
            previousGulfCountries: r.previousGulfCountries || undefined,
            fullPackagePrice: parseFloat(r.fullPackagePrice) || 0,
            depositAmount: parseFloat(r.depositAmount) || 0,
            };
          });

          importWorkers(workers);
          toast({
            title: t("office.csvImported"),
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          setFile(null);
          onClose();
        } catch (error) {
          toast({
            title: "Error importing CSV",
            description: "Please check the CSV format",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      },
      error: (error: Error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("office.importFromCSV")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text color="gray.200">
              Select a CSV file with columns: name, imageUrl, videoUrl, cvUrl,
              salaryPerMonth, sex, age, originCountry, religion, type,
              experienceYears, hasWorkedInGulf, previousGulfCountries,
              fullPackagePrice, depositAmount
            </Text>
            <Box>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: "block", marginTop: "10px" }}
              />
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleImport}
            isDisabled={!file}
          >
            {t("common.import") || "Import"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

