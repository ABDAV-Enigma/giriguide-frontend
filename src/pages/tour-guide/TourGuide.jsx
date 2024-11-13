import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import CustomButton from "../../components/CustomButton";
import FormTourGuide from "../../components/tour-guide/FormTourGuide";
import TourGuideList from "../../components/tour-guide/TourGuideList";
import { useEffect, useState } from "react";
import CustomModal from "../../components/CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchTourGuide } from "../../redux/feature/tourGuideSlice";

const TourGuide = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isModalErrorMessage, setIsModalErrorMessage] = useState(false);
  const { status, error } = useSelector((state) => state.tourGuide);
  const [searchByName, setSearchByName] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    setSearchByName(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchTourGuide({ name: searchByName, page: 1, size: 12 }));
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const handleModalErrorClose = () => {
    setIsModalErrorMessage(false);
  };

  useEffect(() => {
    if (status === "failed") {
      setIsModalErrorMessage(true);
    } else {
      setIsModalErrorMessage(false);
    }
  }, [status]);

  return (
    <section className="font-inter h-full">
      <h1 className="mb-5 text-3xl font-bold text-mainSoil">
        Tour Guide Management
      </h1>
      <CustomModal
        isOpen={isModalErrorMessage}
        onClose={handleModalErrorClose}
        content={error}
      />

      <div className="flex justify-end gap-4 mr-28">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="search"
            className="w-full border border-zinc-400 p-2 rounded-lg text-zinc-950"
            placeholder="Search Mountain Name"
            value={searchByName}
            onChange={handleSearch}
          />
        </form>
        <CustomButton
          customStyles={"w-[200px] mr-28"}
          onClick={handleOpenModal}>
          Add Tour Guide
        </CustomButton>
      </div>
      <Modal
        className="h-4/5 overflow-scroll"
        size="5xl"
        isOpen={isOpenModal}
        onOpenChange={(open) => setIsOpenModal(open)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Tour Guide
              </ModalHeader>
              <ModalBody>
                <FormTourGuide onClose={handleCloseModal} formInput={true} />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={handleCloseModal}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <TourGuideList />
    </section>
  );
};

export default TourGuide;
