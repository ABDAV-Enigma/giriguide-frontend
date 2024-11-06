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
const MountainList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [mountainsPerPage] = useState(5);
  const selectedMountain = useSelector(
    (state) => state.mountain.selectedMountain
  );
  const mountains = useSelector((state) => state.mountain.mountains || []);
  const status = useSelector((state) => state.mountain.status);
  const paging = useSelector((state) => state.mountain.paging);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure(false);

  const handleDelete = (id) => {
    if (!id) {
      alert("Id is required for delete");
      return;
    }

    const isReadyForDelete = confirm(
      `Yakin ingin menghapus gunung dengan id ${id}?`
    );
    if (!isReadyForDelete) {
      return;
    }

    try {
      dispatch(deleteMountain(id));
      dispatch(fetchMountain({ page: currentPage, limit: mountainsPerPage }));
    } catch (error) {
      alert(error?.message);
    }
  };

  const handleDetails = (mountain) => {
    if (!mountain.id) {
      alert("Id is required for update");
      return;
    }
    try {
      dispatch(fetchMountainById(mountain.id));
      dispatch(addMountainId(mountain.id));
      setIsMountainUpdating(true);
      onOpen();
    } catch (error) {
      alert(error?.message);
    }
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    try {
      dispatch(fetchMountain({ page: currentPage, limit: mountainsPerPage }));
    } catch (error) {
      alert(error?.message);
    }
  }, [dispatch, currentPage, mountainsPerPage]);

  return (
    <section className="mt-5 flex flex-col gap-5">
      <Modal
        isOpen={isOpen}
        size="5xl"
        onOpenChange={onOpenChange}
        className="h-4/5 overflow-scroll w-full">
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Mountain
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
                  onPress={() => {
                    onClose();
                    dispatch(clearSeletedHikingPoint());
                    dispatch(setIsMountainUpdating(false));
                    dispatch(setSelectedMountain(null));
                  }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <section className="flex flex-wrap gap-5">
        {status === "loading" ? (
          <div>Loading...</div>
        ) : (
          <>
            {mountains?.map((mountain) => {
              if (!mountain || !mountain?.id) {
                console.error("Invalid mountain data:", mountain);
                return null;
              }
              return (
                <section
                  key={mountain?.id}
                  className="flex gap-4 justify-between mb-5">
                  <section className="flex flex-1 justify-between">
                    <Card shadow="sm" key={mountain?.id} isPressable>
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
                        <section className="buttonGroup flex gap-5">
                          <Button
                            onClick={() => handleDelete(mountain?.id)}
                            className="text-neutral-50 bg-error hover:bg-successfulHover font-bold">
                            Delete
                          </Button>
                          <Button
                            className="text-neutral-50 bg-successful hover:bg-successfulHover font-bold"
                            onClick={() => {
                              handleDetails(mountain);
                            }}>
                            Details
                          </Button>
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

      <Pagination
        total={paging?.totalPages}
        initialPage={paging?.page}
        onChange={(page) => {
          paginate(page);
        }}
      />
    </section>
  );
};

export default MountainList;
