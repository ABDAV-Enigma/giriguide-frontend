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
  createMountain,
  fetchMountain,
  setIsMountainUpdating,
  setSelectedMountain,
  updateMountain,
} from "../../redux/feature/mountainSlice";
import { useDispatch, useSelector } from "react-redux";
import { isPositiveNumber } from "../../validation/validate";
import ConfirmationModal from "../CustomModalConfirmation";

const FormMountain = ({ onClose, formInput = false }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("NORMAL");
  const [message, setMessage] = useState("");
  const [useSimaksi, setUseSimaksi] = useState(false);
  const [simaksiPrice, setSimaksiPrice] = useState("");
  const [image, setImage] = useState(null);
  const [tips, setTips] = useState("");
  const [bestTime, setBestTime] = useState();
  const [isImageValid, setIsImageValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const { selectedMountain, isMountainUpdating } = useSelector(
    (state) => state.mountain
  );
  const mountainStateStatus = useSelector((state) => state.mountain.status);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [isCustomAlertOpen, setIsCustomAlertOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleCloseCustomAlert = () => {
    setIsCustomAlertOpen(false);
    setCustomAlertMessage("");
  };

  const handleOpenCustomAlert = (message) => {
    setIsCustomAlertOpen(true);
    setCustomAlertMessage(message);
  };

  useEffect(() => {
    if (selectedMountain) {
      setName(selectedMountain.name || "");
      setLocation(selectedMountain.city || "");
      setDescription(selectedMountain.description || "");
      setStatus(selectedMountain.status || "");
      setMessage(selectedMountain.message || "");
      setUseSimaksi(selectedMountain.useSimaksi);
      setSimaksiPrice(selectedMountain.priceSimaksi || "");
      setImage(selectedMountain.image || null);
      setTips(selectedMountain.tips || "");
      setBestTime(selectedMountain.bestTime || "");
      fetchMountain();
    }
  }, [selectedMountain]);
  useEffect(() => {
    setIsDescriptionValid(description != null && description.length <= 900);
  }, [description]);

  useEffect(() => {
    if (!image) {
      setIsImageValid(true);
      return;
    }
    setIsImageValid(
      image && (image.type === "image/jpeg" || image.type === "image/png")
    );
  }, [image]);

  const handleAddMountain = async () => {
    const formData = new FormData();
    const editedMountain = {};

    if (isMountainUpdating) {
      if (!selectedMountain) {
        handleOpenCustomAlert("No selected mountain provided");
        return;
      }

      if (selectedMountain.status !== status) {
        editedMountain.status = status;
      }
      if (selectedMountain.message !== message) {
        editedMountain.message = message;
      }
      if (selectedMountain.priceSimaksi !== simaksiPrice) {
        if (!isPositiveNumber(simaksiPrice)) {
          handleOpenCustomAlert("Simaksi price must be a positive number");
          return;
        }
        editedMountain.priceSimaksi = simaksiPrice;
      }
      if (selectedMountain.useSimaksi !== useSimaksi) {
        editedMountain.useSimaksi = useSimaksi;
      }
      if (selectedMountain.name !== name) {
        editedMountain.name = name;
      }
      if (selectedMountain.city !== location) {
        editedMountain.city = location;
      }
      if (selectedMountain.description !== description) {
        if (description?.length > 900) {
          handleOpenCustomAlert("Description must be less than 900 characters");
          return;
        }
        editedMountain.description = description;
      }
      if (selectedMountain.tips !== tips) {
        editedMountain.tips = tips;
      }
      if (selectedMountain.bestTime !== bestTime) {
        editedMountain.bestTime = bestTime;
      }

      if (image.type === "image/jpeg" || image.type === "image/png") {
        formData.append("image", image);
        console.log("Running with image", editedMountain, formData);
        dispatch(
          updateMountain({
            id: selectedMountain.id,
            data: editedMountain,
            image: formData,
          })
        );
      } else {
        console.log("Running without image", editedMountain);
        dispatch(
          updateMountain({
            id: selectedMountain.id,
            data: editedMountain,
          })
        );
      }
      if (mountainStateStatus === "success") {
        openModal();
      }
      resetForm();
      dispatch(setIsMountainUpdating(false));
      dispatch(setSelectedMountain(null));
      return;
    }

    if (!isImageValid) {
      handleOpenCustomAlert("Please upload a valid image");
      return;
    }
    if (!name || !location || !description || !tips || !bestTime || !image) {
      handleOpenCustomAlert("Please fill in all the required fields.");
      return;
    }

    if (!isPositiveNumber(simaksiPrice)) {
      handleOpenCustomAlert("Please use a positive number");
      return;
    }
    if (!isDescriptionValid) {
      handleOpenCustomAlert(
        "Description is too long, please use 900 characters or less"
      );
    }
    formData.append("name", name);
    formData.append("city", location);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("useSimaksi", useSimaksi);
    formData.append("priceSimaksi", simaksiPrice || 0);
    formData.append("status", status);
    formData.append("message", message);
    formData.append("tips", tips);
    formData.append("bestTime", bestTime);

    dispatch(createMountain(formData));
    resetForm();
    dispatch(fetchMountain({ page: 1, size: 12 }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        setIsImageValid(false);
      } else {
        setImage(file);
        setIsImageValid(true);
      }
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setDescription("");
    setImage(null);
    setUseSimaksi(true);
    setSimaksiPrice("");
    setMessage("");
    setStatus("");
    setIsDescriptionValid(true);
    setIsImageValid(true);
    setTips("");
    setBestTime("");
  };

  return (
    <form
      className="flex flex-col gap-4 justify-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        handleAddMountain();
      }}>
      <ConfirmationModal
        onClose={closeModal}
        message={"Data berhasil di Update"}
        isOpen={isModalOpen}
      />
      <h3 className="text-3xl text-successfulHover">
        {!formInput
          ? "Mountain Details"
          : isMountainUpdating
          ? "Edit Mountain"
          : "Add Mountain"}
      </h3>
      <Input
        type="text"
        label="Name"
        color="successSecondary"
        isRequired
        isDisabled={isMountainUpdating == false && formInput == false}
        variant="bordered"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <Input
        type="text"
        label="Location"
        color="successSecondary"
        isRequired
        isDisabled={isMountainUpdating == false && formInput == false}
        variant="bordered"
        onChange={(e) => setLocation(e.target.value)}
        value={location}
      />
      <Textarea
        type="text"
        label="Description"
        color="successSecondary"
        isRequired
        isDisabled={isMountainUpdating == false && formInput == false}
        variant="bordered"
        isInvalid={!isDescriptionValid}
        errorMessage="Description is too long, please use 900 characters or less"
        onChange={(e) => {
          setDescription(e.target.value);
          setIsDescriptionValid(e.target.value.length <= 900);
        }}
        value={description}
      />
      {(isMountainUpdating || formInput) && (
        <Input
          type="file"
          label="Image"
          color="successSecondary"
          isRequired
          isDisabled={isMountainUpdating == false && formInput == false}
          variant="bordered"
          onChange={handleImageChange}
          isInvalid={!isImageValid}
          errorMessage="Image must be in JPEG or PNG format and less than 1MB"
          accept="image/jpeg,image/png"
          max-size={1024 * 1024}
        />
      )}
      <section className="flex w-full gap-4">
        <Select
          label="Status"
          className="w-full"
          isRequired
          isDisabled={isMountainUpdating == false && formInput == false}
          selectedKeys={[status]}
          onChange={(e) => setStatus(e.target.value)}>
          <SelectItem key="NORMAL">NORMAL</SelectItem>
          <SelectItem key="SIAGA">SIAGA</SelectItem>
          <SelectItem key="WASPADA">WASPADA</SelectItem>
          <SelectItem key="AWAS">AWAS</SelectItem>
        </Select>
        <Input
          type="text"
          label="Message"
          color="successSecondary"
          isDisabled={isMountainUpdating == false && formInput == false}
          variant="bordered"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </section>
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
      <section className="flex w-full gap-4">
        <Select
          label="Use Simaksi"
          className="w-full"
          isDisabled={isMountainUpdating == false && formInput == false}
          onChange={(e) => setUseSimaksi(e.target.value === "yes")}
          selectedKeys={useSimaksi ? ["yes"] : ["no"]}>
          <SelectItem key={"yes"}>Yes</SelectItem>
          <SelectItem key={"no"}>No</SelectItem>
        </Select>
        {useSimaksi && (
          <Input
            type="text"
            label="Simaksi Price"
            color="successSecondary"
            isRequired
            isInvalid={!isPositiveNumber(simaksiPrice)}
            errorMessage="Please use a positive number"
            isDisabled={isMountainUpdating == false && formInput == false}
            variant="bordered"
            onChange={(e) => setSimaksiPrice(e.target.value)}
            value={simaksiPrice}
          />
        )}
      </section>
      <Input
        type="text"
        label="Tips"
        color="successSecondary"
        isRequired
        isDisabled={isMountainUpdating == false && formInput == false}
        variant="bordered"
        onChange={(e) => setTips(e.target.value)}
        value={tips}
      />
      <Input
        type="text"
        label="Best Time"
        color="successSecondary"
        isRequired
        isDisabled={isMountainUpdating == false && formInput == false}
        variant="bordered"
        onChange={(e) => setBestTime(e.target.value)}
        value={bestTime}
      />
      {!isMountainUpdating && selectedMountain && (
        <CustomButton
          type="button"
          onPress={() => dispatch(setIsMountainUpdating(true))}>
          Update Mountain
        </CustomButton>
      )}
      {isMountainUpdating && (
        <section className="flex w-full gap-4">
          <CustomButton
            type="submit"
            customStyles={
              isDescriptionValid && (isImageValid || isMountainUpdating)
                ? "w-full"
                : "bg-successfulSecondary text-zinc-900"
            }>
            Submit Updating Mountain
          </CustomButton>
        </section>
      )}
      {formInput && (
        <CustomButton
          type="submit"
          customStyles={
            isDescriptionValid && (isImageValid || isMountainUpdating)
              ? "w-full"
              : "bg-successfulSecondary text-zinc-900"
          }>
          Add Mountain
        </CustomButton>
      )}
    </form>
  );
};

export default FormMountain;
