import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  useDisclosure,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addTourGuideId,
  clearHikingPointIdSelected,
  deleteTourGuide,
  fetchMasteredHikingPoint,
  fetchTourGuide,
  fetchTourGuideById,
  setIsTourGuideUpdating,
  setMountainIdForSelectingHikingPoint,
  setSelectedTourGuide,
} from "../../redux/feature/tourGuideSlice";
import FormTourGuide from "./FormTourGuide";
import TourGuideHikingPointList from "./TourGuideHikingPointList";
import AddMasteredHikingPoint from "./AddMasteredHikingPoint";
import HamsterLoading from "../HamsterLoading";
import { AiOutlineCloseCircle } from "react-icons/ai";

const TourGuideList = () => {
  const { tourGuides, paging, status } = useSelector(
    (state) => state.tourGuide
  );
  const [currentPage, setCurrentPage] = useState(1);
  const tourGuidesPerPage = 12;
  const dispatch = useDispatch();
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [isCustomAlertOpen, setIsCustomAlertOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure(false);

  const handleCloseCustomAlert = () => {
    setIsCustomAlertOpen(false);
    setIsDelete(false);
    setDeleteId(null);
    setCustomAlertMessage("");
  };

  const handleOpenCustomAlert = (message) => {
    setIsCustomAlertOpen(true);
    setCustomAlertMessage(message);
  };
  const confirmDelete = (id, name) => {
    setIsDelete(true);
    setDeleteId(id);
    handleOpenCustomAlert(
      `Apakah Anda yakin ingin menghapus ${name}? Tindakan ini tidak dapat dibatalkan.`
    );
  };

  const handleChangePagination = (page) => {
    setCurrentPage(page);
  };
  const handleTourGuideDetailsClose = () => {
    onClose();
    dispatch(setIsTourGuideUpdating(false));
    dispatch(setSelectedTourGuide(null));
    dispatch(setMountainIdForSelectingHikingPoint(null));
    dispatch(clearHikingPointIdSelected());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(
          fetchTourGuide({ page: currentPage, size: tourGuidesPerPage })
        ).unwrap();
      } catch (error) {
        handleOpenCustomAlert(error.message || "An error occurred");
      }
    };
    fetchData();
  }, [dispatch, currentPage, tourGuidesPerPage]);

  const handleDelete = async (id) => {
    if (!id) {
      handleOpenCustomAlert("Id is required for delete");
      return;
    }
    try {
      await dispatch(deleteTourGuide(id)).unwrap();
      await dispatch(
        fetchTourGuide({ page: currentPage, size: tourGuidesPerPage })
      ).unwrap();
      // handleTourGuideDetailsClose();
    } catch (error) {
      handleOpenCustomAlert(error.message || "An error occurred");
    }
  };

  const handleDetails = async (tourGuide) => {
    if (!tourGuide?.id) {
      handleCloseCustomAlert("Id is required for update");
      return;
    }

    try {
      dispatch(fetchTourGuideById(tourGuide.id));
      dispatch(addTourGuideId(tourGuide.id));
      dispatch(fetchMasteredHikingPoint(tourGuide.id));
      dispatch(setIsTourGuideUpdating(false));
      onOpen();
    } catch (error) {
      handleOpenCustomAlert(error.message || "An error occurred");
    }
  };

  return (
    <>
      {status === "loading" && <HamsterLoading />}
      <section className="mt-5 flex flex-wrap gap-5 justify-center">
        <Modal
          isOpen={isOpen}
          size="5xl"
          onClose={handleTourGuideDetailsClose}
          onOpenChange={onOpenChange}
          className="h-4/5 overflow-scroll">
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Tour Guide
                </ModalHeader>
                <ModalBody>
                  <section className="flex gap-5 w-full px-5 py-2">
                    <FormTourGuide onClose={handleTourGuideDetailsClose} />
                    <section className="w-full">
                      <AddMasteredHikingPoint />
                      <TourGuideHikingPointList />
                    </section>
                  </section>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleTourGuideDetailsClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

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
                  {isDelete ? "Delete" : "Error"}
                </ModalHeader>
                <ModalBody className="flex justify-center items-center">
                  <AiOutlineCloseCircle className="text-error text-center text-9xl mb-8 mt-3" />
                  <p className="text-center text-error">{customAlertMessage}</p>
                </ModalBody>
                <ModalFooter className="flex gap-2 items-center">
                  {isDelete && (
                    <button
                      className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-md"
                      onClick={() => handleDelete(deleteId)}>
                      Delete
                    </button>
                  )}
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
        {tourGuides.length === 0 && (
          <section className="flex justify-center items-center">
            <p className="text-center text-2xl text-zinc-500 font-bold">
              No Tour Guides
            </p>
          </section>
        )}
        {tourGuides?.map((tourGuide) => {
          if (!tourGuide?.id) return null;
          return (
            <section key={tourGuide.id} className="mt-5 flex flex-col gap-5">
              <section className="flex flex-1 justify-between">
                <Card
                  shadow="sm"
                  className="w-[300px]"
                  isPressable
                  onPress={() => console.log("item pressed")}>
                  <CardBody className="overflow-visible p-0">
                    <Image
                      shadow="sm"
                      radius="lg"
                      width="100%"
                      alt={tourGuide.name}
                      className="w-full object-cover h-[140px]"
                      src={tourGuide.image}
                    />
                  </CardBody>
                  <CardFooter className="text-small justify-between gap-5">
                    <b>{tourGuide.name}</b>
                    <section className="buttonGroup flex gap-4 items-center">
                      <button
                        onClick={() =>
                          confirmDelete(tourGuide.id, tourGuide.name)
                        }
                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-md">
                        Delete
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-md"
                        onClick={() => handleDetails(tourGuide)}>
                        Detail
                      </button>
                    </section>
                  </CardFooter>
                </Card>
              </section>
            </section>
          );
        })}
      </section>

      <Pagination
        total={paging?.totalPages}
        page={currentPage}
        onChange={handleChangePagination}
        classNames={{
          wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
          item: "w-8 h-8 text-small rounded-none bg-transparent",
          cursor:
            "bg-gradient-to-b shadow-lg from-mainSoil to-default-800 text-white font-bold",
        }}
        rounded
      />
    </>
  );
};

export default TourGuideList;
