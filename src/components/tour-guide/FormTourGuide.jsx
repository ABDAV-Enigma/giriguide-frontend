import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import {
  createTourGuide,
  setIsTourGuideUpdating,
  updateTourGuide,
} from "../../redux/feature/tourGuideSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  isPositiveNumber,
  isStrongPassword,
  isEmailValid,
  isNikValid,
  isPositiveNumberWithMinValue,
} from "../../validation/validate";
import ConfirmationModal from "../CustomModalConfirmation";

const FormTourGuide = ({ formInput = false, onClose }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [nik, setNIK] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [maxHiker, setMaxHiker] = useState("");
  const [price, setPrice] = useState("");
  const [additionalPrice, setAdditionalPrice] = useState("");
  const [totalPorter, setTotalPorter] = useState("");
  const [pricePorter, setPricePorter] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [bankAccount, setBankAccount] = useState("");

  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [isImageValid, setIsImageValid] = useState(true);
  const [isValidNIK, setIsValidNIK] = useState(true);
  const [isValidOld, setIsValidOld] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedTourGuide, isTourGuideUpdating, tourGuideId } = useSelector(
    (state) => state.tourGuide
  );

  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [isCustomAlertOpen, setIsCustomAlertOpen] = useState(false);

  const handleCloseCustomAlert = () => {
    setIsCustomAlertOpen(false);
    setCustomAlertMessage("");
  };

  const handleOpenCustomAlert = (message) => {
    setIsCustomAlertOpen(true);
    setCustomAlertMessage(message);
  };

  useEffect(() => {
    if (selectedTourGuide) {
      setName(selectedTourGuide.name);
      setNIK(selectedTourGuide.nik);
      setAddress(selectedTourGuide.address);
      setDescription(selectedTourGuide.description);
      setImage(selectedTourGuide.image);
      setEmail(selectedTourGuide.email);
      setMaxHiker(selectedTourGuide.maxHiker);
      setPrice(selectedTourGuide.price);
      setAdditionalPrice(selectedTourGuide.additionalPrice);
      setTotalPorter(selectedTourGuide.totalPorter);
      setPricePorter(selectedTourGuide.pricePorter);
      setBirthDate(
        new Date(selectedTourGuide.birthDate).toISOString().split("T")[0]
      );
      setGender(selectedTourGuide.gender);
      setBankAccount(selectedTourGuide.bankAccount);
    }
  }, [selectedTourGuide]);

  useEffect(() => {
    setIsValidNIK(isNikValid(nik));
  }, [nik]);

  useEffect(() => {
    setIsDescriptionValid(description?.length <= 900);
  }, [description]);

  const validate17Year = () => {
    const today = new Date();
    const minYear = today.getFullYear() - 17;
    const minDate = new Date(minYear, today.getMonth(), today.getDate());
    return new Date(birthDate) >= minDate;
  };
  useEffect(() => {
    setIsValidOld(validate17Year());
  }, [birthDate]);

  useEffect(() => {
    if (!isTourGuideUpdating) {
      if (image && image.type !== "image/jpeg" && image.type !== "image/png") {
        setIsImageValid(false);
      } else {
        setIsImageValid(true);
      }
    }
  }, [image]);

  const handleAddTourGuide = (e) => {
    e.preventDefault();
    if (isTourGuideUpdating && selectedTourGuide) {
      const tourGuideUpdate = {};
      if (selectedTourGuide.name != name) {
        tourGuideUpdate.name = name;
      }
      if (selectedTourGuide.nik != nik) {
        if (!isNikValid(nik)) {
          handleOpenCustomAlert("Invalid NIK");
          return;
        }
        tourGuideUpdate.nik = nik;
      }
      if (selectedTourGuide.address != address) {
        tourGuideUpdate.address = address;
      }
      if (selectedTourGuide.description != description) {
        if (description?.length > 900) {
          handleOpenCustomAlert("Description must be less than 900 characters");
          return;
        }
        tourGuideUpdate.description = description;
      }
      if (selectedTourGuide.maxHiker != maxHiker) {
        if (!isPositiveNumberWithMinValue(maxHiker, 5)) {
          handleOpenCustomAlert("Maximum hiker must be a positive number.");
          return;
        }
        tourGuideUpdate.maxHiker = maxHiker;
      }
      if (selectedTourGuide.price != price) {
        if (!isPositiveNumber(price)) {
          handleOpenCustomAlert("Price must be a positive number.");
          return;
        }
        tourGuideUpdate.price = price;
      }
      if (selectedTourGuide.additionalPrice != additionalPrice) {
        if (!isPositiveNumber(additionalPrice)) {
          handleOpenCustomAlert("Additional price must be a positive number.");
          return;
        }
        tourGuideUpdate.additionalPrice = additionalPrice;
      }
      if (selectedTourGuide.totalPorter != totalPorter) {
        if (!isPositiveNumber(totalPorter)) {
          handleOpenCustomAlert("Total porter must be a positive number.");
          return;
        }
        tourGuideUpdate.totalPorter = totalPorter;
      }
      if (selectedTourGuide.pricePorter != pricePorter) {
        if (!isPositiveNumber(pricePorter)) {
          handleOpenCustomAlert("Price porter must be a positive number.");
          return;
        }
        tourGuideUpdate.pricePorter = pricePorter;
      }
      if (selectedTourGuide.birthDate != birthDate) {
        if (!isValidOld) {
          handleOpenCustomAlert("Tour guide must be at least 17 years old.");
          return;
        }
        tourGuideUpdate.birthDate = birthDate;
      }
      if (selectedTourGuide.gender != gender) {
        tourGuideUpdate.gender = gender;
      }
      if (selectedTourGuide.bankAccount != bankAccount) {
        if (!isPositiveNumber(bankAccount)) {
          handleOpenCustomAlert(
            "Bank account number must be a positive number."
          );
          return;
        }
        tourGuideUpdate.bankAccount = bankAccount;
      }

      if (image.type === "image/jpeg" || image.type === "image/png") {
        const formData = new FormData();
        formData.append("image", image);
        dispatch(
          updateTourGuide({
            id: tourGuideId,
            data: tourGuideUpdate,
            image: formData,
          })
        ).then(() => {
          openModal();
        });
      } else {
        dispatch(
          updateTourGuide({ id: tourGuideId, data: tourGuideUpdate })
        ).then(() => {
          openModal();
        });
      }
      return;
    }

    if (
      !name ||
      !nik ||
      !description ||
      !image ||
      !email ||
      !password ||
      !maxHiker ||
      !price ||
      !additionalPrice ||
      !totalPorter ||
      !pricePorter ||
      !birthDate ||
      !gender ||
      !address ||
      !bankAccount
    ) {
      handleOpenCustomAlert("Please fill in all the required fields.");
      return;
    }
    if (!isPositiveNumberWithMinValue(maxHiker, 5)) {
      handleOpenCustomAlert("Max Hiker must be a positive number and");
      return;
    }

    if (!isPositiveNumber(price)) {
      handleOpenCustomAlert("Price must be a positive number.");
      return;
    }

    if (!isPositiveNumber(additionalPrice)) {
      handleOpenCustomAlert("Additional Price must be a positive number.");
      return;
    }

    if (!isPositiveNumber(totalPorter)) {
      handleOpenCustomAlert("Total Porter must be a positive number.");
      return;
    }

    if (!isPositiveNumber(pricePorter)) {
      handleOpenCustomAlert("Price Porter must be a positive number.");
      return;
    }
    if (!isImageValid) {
      handleOpenCustomAlert(
        "Image must be a JPEG or PNG file and less than 1MB."
      );
      return;
    }
    if (!isEmailValid(email)) {
      handleOpenCustomAlert("Email is not valid.");
      return;
    }
    if (!isValidNIK) {
      handleOpenCustomAlert("NIK is not valid.");
      return;
    }
    if (isValidOld) {
      handleOpenCustomAlert("You must be at least 17 years old.");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("nik", nik);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("maxHiker", maxHiker);
    formData.append("price", price);
    formData.append("additionalPrice", additionalPrice);
    formData.append("totalPorter", totalPorter);
    formData.append("pricePorter", pricePorter);
    formData.append("birthDate", birthDate);
    formData.append("gender", gender);
    formData.append("bankAccount", bankAccount);

    dispatch(createTourGuide(formData));
    clearState();
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const clearState = () => {
    setName("");
    setNIK("");
    setAddress("");
    setDescription("");
    setImage(null);
    setEmail("");
    setPassword("");
    setMaxHiker("");
    setPrice("");
    setAdditionalPrice("");
    setTotalPorter("");
    setPricePorter("");
    setBirthDate("");
    setGender("");
    setBankAccount("");
    setIsDescriptionValid(true);
    setIsImageValid(true);
    setIsValidNIK(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 justify-center"
      onSubmit={handleAddTourGuide}>
      <h3 className="text-3xl text-successfulHover">
        {!formInput
          ? isTourGuideUpdating
            ? "Update Tour Guide"
            : "Tour Guide Details"
          : "Add Tour Guide"}
      </h3>
      <section className="flex gap-4 w-full">
        <Input
          type="text"
          label="Full Name"
          color="successSecondary"
          variant="bordered"
          isRequired
          isDisabled={isTourGuideUpdating == false && formInput == false}
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <section className="w-full flex flex-col gap-4">
          <Input
            isDisabled={isTourGuideUpdating == false && formInput == false}
            type="text"
            label="NIK"
            color="successSecondary"
            isRequired
            isInvalid={!isPositiveNumber(nik) || !isValidNIK}
            errorMessage="NIK must be longer than 16 digits and only numbers"
            variant="bordered"
            onChange={(e) => setNIK(e.target.value)}
            value={nik}
          />
        </section>
      </section>
      <Input
        isDisabled={isTourGuideUpdating == false && formInput == false}
        type="text"
        label="Address"
        color="successSecondary"
        isRequired
        variant="bordered"
        onChange={(e) => setAddress(e.target.value)}
        value={address}
      />
      <Textarea
        isDisabled={isTourGuideUpdating == false && formInput == false}
        type="text"
        label="Description"
        color="successSecondary"
        isRequired
        variant="bordered"
        isInvalid={!isDescriptionValid}
        errorMessage="Description is too long, please use 900 characters or less"
        onChange={(e) => {
          setDescription(e.target.value);
          setIsDescriptionValid(e.target.value.length <= 900);
        }}
        value={description}
      />
      {(isTourGuideUpdating || formInput) && (
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="file"
          label="Image"
          color="successSecondary"
          isRequired
          isInvalid={!isImageValid && !isTourGuideUpdating}
          errorMessage="Image must be in JPEG or PNG format and less than 1MB"
          variant="bordered"
          onChange={handleImageChange}
        />
      )}
      <section className="flex gap-4 w-full">
        <Input
          isDisabled={!formInput}
          type="email"
          label="Email"
          color="successSecondary"
          isRequired
          isInvalid={!isEmailValid(email)}
          errorMessage="Please enter a valid email"
          variant="bordered"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {formInput && (
          <Input
            isDisabled={isTourGuideUpdating == false && formInput == false}
            type="password"
            label="Password"
            color="successSecondary"
            variant="bordered"
            isRequired
            isInvalid={!isStrongPassword(password)}
            errorMessage="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        )}
      </section>
      <section className="flex gap-4 w-full">
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="text"
          label="Max Hiker"
          color="successSecondary"
          isRequired
          isInvalid={!isPositiveNumberWithMinValue(maxHiker, 5)}
          errorMessage="Please use a positive number and min 5"
          variant="bordered"
          onChange={(e) => setMaxHiker(e.target.value)}
          value={maxHiker}
        />
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="text"
          label="Price"
          color="successSecondary"
          isRequired
          isInvalid={!isPositiveNumber(price)}
          errorMessage="Please use a positive number"
          variant="bordered"
          onChange={(e) => setPrice(e.target.value)}
          value={price}
        />
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="text"
          label="Additional Price"
          color="successSecondary"
          isRequired
          isInvalid={!isPositiveNumber(additionalPrice)}
          errorMessage="Please use a positive number"
          variant="bordered"
          onChange={(e) => setAdditionalPrice(e.target.value)}
          value={additionalPrice}
        />
      </section>

      <section className="flex gap-4 w-full">
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="text"
          label="Total Porter"
          color="successSecondary"
          isRequired
          isInvalid={!isPositiveNumber(totalPorter)}
          errorMessage="Please use a positive number"
          variant="bordered"
          onChange={(e) => setTotalPorter(e.target.value)}
          value={totalPorter}
        />
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="text"
          label="Price Porter"
          color="successSecondary"
          isRequired
          isInvalid={!isPositiveNumber(pricePorter)}
          errorMessage="Please use a positive number"
          variant="bordered"
          onChange={(e) => setPricePorter(e.target.value)}
          value={pricePorter}
        />
      </section>
      <section className="flex gap-4 w-full">
        <Input
          isDisabled={isTourGuideUpdating == false && formInput == false}
          type="date"
          label="Birth Date"
          color="successSecondary"
          isRequired
          variant="bordered"
          isInvalid={isValidOld}
          errorMessage="Tour guide must be older than 17 years old"
          onChange={(e) => setBirthDate(e.target.value)}
          value={birthDate}
        />
        <Select
          isDisabled={isTourGuideUpdating === false && formInput === false}
          label="Gender"
          color="successSecondary"
          isRequired
          variant="bordered"
          selectedKeys={[gender]}
          onSelectionChange={(keys) => setGender(Array.from(keys)[0])}>
          <SelectItem key="MALE">MALE</SelectItem>
          <SelectItem key="FEMALE">FEMALE</SelectItem>
        </Select>
      </section>
      <Input
        isDisabled={isTourGuideUpdating == false && formInput == false}
        type="text"
        label="Bank Account"
        color="successSecondary"
        isRequired
        isInvalid={!isPositiveNumber(bankAccount)}
        errorMessage="Please enter a valid bank account"
        variant="bordered"
        onChange={(e) => setBankAccount(e.target.value)}
        value={bankAccount}
      />
      {!isTourGuideUpdating && selectedTourGuide && (
        <CustomButton
          type="button"
          onPress={() => dispatch(setIsTourGuideUpdating(true))}>
          Update Tour Guide
        </CustomButton>
      )}
      <ConfirmationModal
        onClose={closeModal}
        message={"Data berhasil di Update"}
        isOpen={isModalOpen}
      />
      {isTourGuideUpdating && (
        <section className="flex w-full gap-4">
          <CustomButton
            type="submit"
            customStyles={
              isDescriptionValid && (isImageValid || isTourGuideUpdating)
                ? "w-full"
                : "bg-successfulSecondary text-zinc-900"
            }>
            Submit Updating Tour Guide
          </CustomButton>
        </section>
      )}
      {formInput && (
        <CustomButton
          type="submit"
          customStyles={
            isDescriptionValid && (isImageValid || isTourGuideUpdating)
              ? "w-full"
              : "bg-successfulSecondary text-zinc-900"
          }>
          Add Tour Guide
        </CustomButton>
      )}
      <Modal
        isOpen={isCustomAlertOpen}
        onClose={handleCloseCustomAlert}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {"Message"}
              </ModalHeader>
              <ModalBody>
                <p className="text-error">{customAlertMessage}</p>
              </ModalBody>
              <ModalFooter className="flex gap-2 items-center">
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseCustomAlert}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </form>
  );
};

export default FormTourGuide;
