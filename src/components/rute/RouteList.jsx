import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRoute,
  fetchRoute,
  fetchRouteDetailById,
  setIdRouteForUpdate,
  setIsRouteUpdating,
} from "../../redux/feature/routeSlice";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  useDisclosure,
} from "@nextui-org/react";
import CustomModal from "../CustomModal";
import { AiOutlineCloseCircle } from "react-icons/ai";

const RouteList = () => {
  const dispatch = useDispatch();
  const { routes, isRouteUpdating, paging } = useSelector(
    (state) => state.route
  );
  const routesDetail = useSelector((state) => state.route.routesDetail);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
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
    handleOpenCustomAlert(`Yakin ingin menghapus route ${name}?`);
  };

  const handleChangePagination = (page) => {
    setPage(page);
  };
  const handleDetails = (id) => {
    dispatch(fetchRouteDetailById(id));
    onOpen();
  };
  const handleDelete = (id) => {
    if (!id) {
      handleOpenCustomAlert("Id is required for delete");
      return;
    }
    if (confirm("Are you sure you want to delete this route?")) {
      dispatch(deleteRoute(id));
    }
  };

  useEffect(() => {
    dispatch(fetchRoute({ page, size }));
  }, [page, size]);

  return (
    <section className="flex flex-col">
      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpen}
        onClose={onClose}
        content={
          <div className="mt-1">
            <p className="font-medium mb-2">Rute : {routesDetail?.title}</p>
            <p className="font-medium mb-4">
              Deskripsi : {routesDetail?.description}
            </p>
            <p className="font-medium mb-1">Alur Rute : </p>
            {routesDetail?.routes.map((route, index) => (
              <p
                className="font-medium mb-1"
                key={route?.from + route?.to + Math.random() * 100}>
                {index + 1}. Dari {route?.from} ke {route?.to} dengan{" "}
                {route?.transportation} dengan estimasi waktu {route?.estimate}{" "}
                dan jarak {route?.distance}
              </p>
            ))}
          </div>
        }
        title="Details Routes"
        primaryActionText={"Update"}
        secondaryActionText={"Close"}
        onPrimaryAction={() => {
          dispatch(setIdRouteForUpdate(routesDetail?.id));
          dispatch(fetchRouteDetailById(routesDetail?.id));
          dispatch(setIsRouteUpdating(true));
          onClose();
        }}
        onSecondaryAction={onClose}
      />
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
      <Card className="mb-3">
        <CardBody className="flex bg-mainSoil text-white flex-row justify-between">
          <section className="flex gap-4 px-6">
            <p className="w-[150px] font-bold text-md">Judul</p>
            <p className="w-[200px] ml-14 font-bold text-md">Deskripsi</p>
          </section>
          <p className="w-[150px] font-bold text-md">Action</p>
        </CardBody>
      </Card>
      {routes.length === 0 && (
        <section className="flex justify-center items-center">
          <p className="text-center text-2xl text-zinc-500 font-bold">
            No Routes
          </p>
        </section>
      )}{" "}
      {routes.map((route) => (
        <Card key={route.id} className="mb-3">
          <CardBody className="flex flex-row justify-between items-center text-mainSoil">
            <section className="flex gap-4 px-6">
              <p className="w-[200px] font-bold text-md">{route.title}</p>
              <p className="w-auto">{route.description}</p>
            </section>
            <section className="flex gap-3 items-center">
              <button
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 border-b-4 border-red-700 hover:border-red-500 rounded-md"
                onClick={() => confirmDelete(route.id, route.title)}>
                Delete
              </button>
              <button
                onClick={() => {
                  handleDetails(route.id);
                }}
                // text='Approve'
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded-md">
                Details
              </button>
            </section>
          </CardBody>
        </Card>
      ))}
      <Pagination
        total={paging?.totalPages}
        page={page}
        onChange={handleChangePagination}
        classNames={{
          wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
          item: "w-8 h-8 text-small rounded-none bg-transparent",
          cursor:
            "bg-gradient-to-b shadow-lg from-mainSoil to-default-800 text-white font-bold",
        }}
        rowsPerPage={size}
        rounded
      />
    </section>
  );
};

export default RouteList;
