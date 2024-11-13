import { useDispatch, useSelector } from "react-redux";
import {
  deleteMountain,
  fetchMountain,
  fetchMountainById,
  setIsMountainUpdating,
  setSelectedMountain,
} from "../../redux/feature/mountainSlice";
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
import { useEffect, useState } from "react";
import FormMountain from "./FormMountain";
import {
  addMountainId,
  clearSeletedHikingPoint,
} from "../../redux/feature/hikingPointSlice";
import FormHikingPoint from "../hikingPoint/FormHikingPoint";
import HikingPointList from "../hikingPoint/HikingPointList";
import HamsterLoading from "../HamsterLoading";
import { AiOutlineCloseCircle } from "react-icons/ai";

const MountainList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [mountainsPerPage, setMountainsPerPage] = useState(12);
  const selectedMountain = useSelector(
    (state) => state.mountain.selectedMountain
  );
  const mountains = useSelector((state) => state.mountain.mountains || []);
  const status = useSelector((state) => state.mountain.status);
  const paging = useSelector((state) => state.mountain.paging);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [isCustomAlertOpen, setIsCustomAlertOpen] = useState(false);
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

  const handleChangePagination = (page) => {
    setCurrentPage(page);
  };

  const handleOnMountainDetailsClose = () => {
    onClose();
    dispatch(clearSeletedHikingPoint());
    dispatch(setIsMountainUpdating(false));
    dispatch(setSelectedMountain(null));
  };

  const confirmDelete = (id, name) => {
    setIsDelete(true);
    setDeleteId(id);
    handleOpenCustomAlert(`Yakin ingin menghapus  ${name}?`);
  };

  const handleDelete = (id) => {
    if (!id) {
      handleOpenCustomAlert("Id is required for delete");
      return;
    }
    try {
      dispatch(deleteMountain(id));
      dispatch(fetchMountain({ page: currentPage, size: mountainsPerPage }));
      handleCloseCustomAlert();
    } catch (error) {
      handleOpenCustomAlert(error?.message);
    }
  };

  const handleDetails = async (mountain) => {
    if (!mountain.id) {
      handleOpenCustomAlert("Id is required for update");
      return;
    }
    try {
      await dispatch(fetchMountainById(mountain.id));
      await dispatch(addMountainId(mountain.id));
      setIsMountainUpdating(true);
      onOpen();
    } catch (error) {
      handleOpenCustomAlert(error?.message);
    }
  };

  useEffect(() => {
    try {
      dispatch(fetchMountain({ page: currentPage, size: mountainsPerPage }));
    } catch (error) {
      handleOpenCustomAlert(error?.message);
    }
  }, [dispatch, currentPage, mountainsPerPage]);

  return (
    <section>
      <section className="mt-5 flex flex-col gap-5">
        <Modal
          isOpen={isOpen}
          size="5xl"
          onClose={handleOnMountainDetailsClose}
          onOpenChange={onOpenChange}
          className="h-4/5 overflow-scroll w-full">
          <ModalContent>
            {(closeModal) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Mountain
                </ModalHeader>
                <ModalBody>
                  <section className="flex gap-5 w-full px-5 py-2">
                    <FormMountain
                      onClose={() => {
                        closeModal();
                      }}
                    />
                    <section className="w-full">
                      <FormHikingPoint onClose={closeModal} />
                      <HikingPointList id={selectedMountain?.id} />
                    </section>
                  </section>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleOnMountainDetailsClose}>
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
                  <p className="text-error">{customAlertMessage}</p>
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
        <section className="flex flex-wrap justify-center gap-5">
          {status === "loading" ? (
            <HamsterLoading></HamsterLoading>
          ) : (
            <>
              {mountains.length === 0 && (
                <section className="flex justify-center items-center">
                  <p className="text-center text-2xl text-zinc-500 font-bold">
                    No Mountains
                  </p>
                </section>
              )}
              {mountains?.map((mountain) => {
                if (!mountain || !mountain?.id) {
                  handleOpenCustomAlert("Invalid mountain data:", mountain);
                  return null;
                }
                return (
                  <section
                    key={mountain?.id}
                    className="flex gap-4 justify-between mb-5">
                    <section className="flex flex-1 justify-between w-[300px]">
                      <Card
                        shadow="sm"
                        key={mountain?.id}
                        isPressable
                        className="w-[300px]">
                        <CardBody className="overflow-visible p-0">
                          <Image
                            shadow="sm"
                            radius="lg"
                            width="100%"
                            alt={mountain?.name || "Mountain Image"}
                            className="w-full object-cover h-[140px]"
                            src={mountain?.image}
                          />
                        </CardBody>
                        <CardFooter className="text-small justify-between gap-5">
                          <b>{mountain?.name}</b>
                          <section className="buttonGroup flex gap-2 items-center">
                            {/* <MdDelete
                              className="text-3xl text-error font-bold"
                              onClick={() =>
                                confirmDelete(mountain?.id, mountain.name)
                              }
                              
                            /> */}
                            <button
                              className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-md"
                              onClick={() =>
                                confirmDelete(mountain?.id, mountain.name)
                              }>
                              Delete
                            </button>
                            <button
                              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-md"
                              onClick={() => {
                                handleDetails(mountain);
                              }}>
                              Details
                            </button>
                          </section>
                        </CardFooter>
                      </Card>
                    </section>
                  </section>
                );
              })}
            </>
          )}
        </section>
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
        rowsPerPage={mountainsPerPage}
        rounded
      />
    </section>
  );
};

export default MountainList;
