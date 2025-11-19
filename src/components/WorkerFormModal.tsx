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
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import type { Worker, WorkerType, WorkerSex } from "../types";

interface WorkerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: Worker | null;
}

export const WorkerFormModal = ({
  isOpen,
  onClose,
  worker,
}: WorkerFormModalProps) => {
  const { t } = useTranslation();
  const { currentUser, addWorker, updateWorker } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    videoUrl: "",
    cvUrl: "",
    salaryPerMonth: 0,
    sex: "female" as WorkerSex,
    age: 0,
    originCountry: "",
    religion: "",
    type: "housekeeper" as WorkerType,
    experienceYears: 0,
    hasWorkedInGulf: false,
    previousGulfCountries: "",
    fullPackagePrice: 0,
    depositAmount: 0,
  });

  useEffect(() => {
    if (worker) {
      setFormData({
        name: worker.name,
        imageUrl: worker.imageUrl,
        videoUrl: worker.videoUrl,
        cvUrl: worker.cvUrl,
        salaryPerMonth: worker.salaryPerMonth,
        sex: worker.sex,
        age: worker.age,
        originCountry: worker.originCountry,
        religion: worker.religion,
        type: worker.type,
        experienceYears: worker.experienceYears,
        hasWorkedInGulf: worker.hasWorkedInGulf,
        previousGulfCountries: worker.previousGulfCountries || "",
        fullPackagePrice: worker.fullPackagePrice,
        depositAmount: worker.depositAmount,
      });
    } else {
      setFormData({
        name: "",
        imageUrl: "",
        videoUrl: "",
        cvUrl: "",
        salaryPerMonth: 0,
        sex: "female",
        age: 0,
        originCountry: "",
        religion: "",
        type: "housekeeper",
        experienceYears: 0,
        hasWorkedInGulf: false,
        previousGulfCountries: "",
        fullPackagePrice: 0,
        depositAmount: 0,
      });
    }
  }, [worker, isOpen]);

  const handleSubmit = () => {
    if (!currentUser?.officeId) return;

    const workerData = {
      ...formData,
      officeId: currentUser.officeId,
      previousGulfCountries: formData.hasWorkedInGulf
        ? formData.previousGulfCountries
        : undefined,
    };

    if (worker) {
      updateWorker(worker.id, workerData);
      toast({
        title: t("office.workerUpdated"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      addWorker(workerData);
      toast({
        title: t("office.workerAdded"),
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {worker ? t("common.edit") : t("office.addWorker")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>{t("worker.form.name")}</FormLabel>
              <Input
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.imageUrl")}</FormLabel>
              <Input
                value={formData.imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t("worker.form.videoUrl")}</FormLabel>
              <Input
                value={formData.videoUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t("worker.form.cvUrl")}</FormLabel>
              <Input
                value={formData.cvUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, cvUrl: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.salaryPerMonth")}</FormLabel>
              <NumberInput
                value={formData.salaryPerMonth}
                onChange={(_valueAsString: string, val: number) =>
                  setFormData({ ...formData, salaryPerMonth: val || 0 })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.sex")}</FormLabel>
              <Select
                value={formData.sex}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({
                    ...formData,
                    sex: e.target.value as WorkerSex,
                  })
                }
              >
                <option value="male">{t("worker.form.male")}</option>
                <option value="female">{t("worker.form.female")}</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.age")}</FormLabel>
              <NumberInput
                value={formData.age}
                onChange={(_valueAsString: string, val: number) =>
                  setFormData({ ...formData, age: val || 0 })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.originCountry")}</FormLabel>
              <Input
                value={formData.originCountry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, originCountry: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.religion")}</FormLabel>
              <Input
                value={formData.religion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, religion: e.target.value })
                }
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.type")}</FormLabel>
              <Select
                value={formData.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as WorkerType,
                  })
                }
              >
                <option value="driver">{t("worker.form.driver")}</option>
                <option value="housekeeper">{t("worker.form.housekeeper")}</option>
                <option value="nanny">{t("worker.form.nanny")}</option>
                <option value="cook">{t("worker.form.cook")}</option>
                <option value="gardener">{t("worker.form.gardener")}</option>
                <option value="elderly-care">{t("worker.form.elderlyCare")}</option>
                <option value="babysitter">{t("worker.form.babysitter")}</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.experienceYears")}</FormLabel>
              <NumberInput
                value={formData.experienceYears}
                onChange={(_valueAsString: string, val: number) =>
                  setFormData({ ...formData, experienceYears: val || 0 })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <Checkbox
                isChecked={formData.hasWorkedInGulf}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      hasWorkedInGulf: e.target.checked,
                    })
                  }
              >
                {t("worker.form.hasWorkedInGulf")}
              </Checkbox>
            </FormControl>

            {formData.hasWorkedInGulf && (
              <FormControl>
                <FormLabel>{t("worker.form.previousGulfCountries")}</FormLabel>
                <Input
                  value={formData.previousGulfCountries}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      previousGulfCountries: e.target.value,
                    })
                  }
                />
              </FormControl>
            )}

            <FormControl isRequired>
              <FormLabel>{t("worker.form.fullPackagePrice")}</FormLabel>
              <NumberInput
                value={formData.fullPackagePrice}
                onChange={(_valueAsString: string, val: number) =>
                  setFormData({ ...formData, fullPackagePrice: val || 0 })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{t("worker.form.depositAmount")}</FormLabel>
              <NumberInput
                value={formData.depositAmount}
                onChange={(_valueAsString: string, val: number) =>
                  setFormData({ ...formData, depositAmount: val || 0 })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit}>
            {t("common.save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

