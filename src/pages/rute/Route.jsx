import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import RouteForm from "../../components/rute/RouteForm";
import RouteList from "../../components/rute/RouteList";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import {
  clearFragmentRoute,
  fetchRoute,
  setIsRouteUpdating,
} from "../../redux/feature/routeSlice";

const Route = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isModalErrorMessage, setIsModalErrorMessage] = useState(false);
  const [searchByTitle, setSearchByTitle] = useState("");
  const { isRouteUpdating } = useSelector((state) => state.route);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    if (isRouteUpdating) {
      dispatch(clearFragmentRoute());
      dispatch(setIsRouteUpdating(false));
    }
  };

  useEffect(() => {
    dispatch(fetchRoute({ page: 1, size: 12, title: searchByTitle }));
  }, [searchByTitle]);

  return (
    <section className="flex flex-col gap-6">
      <section>
        <h1 className="text-3xl font-bold text-mainSoil">Route Management</h1>
      </section>
      <div className="flex justify-end gap-4">
        <form>
          <input
            type="search"
            className="w-full border border-zinc-400 p-2 rounded-lg text-zinc-950"
            placeholder="Search Route Title"
            value={searchByTitle}
            onChange={(e) => setSearchByTitle(e.target.value)}
          />
        </form>
        <CustomButton customStyles={"w-[200px]"} onClick={handleOpenModal}>
          {isRouteUpdating ? "Update" : "Create New"} Route
        </CustomButton>
      </div>
      <Modal
        isOpen={isOpenModal || isRouteUpdating}
        onClose={handleCloseModal}
        onOpenChange={(open) => setIsOpenModal(open)}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Route
              </ModalHeader>
              <ModalBody>
                <RouteForm formInput={true} onClose={handleCloseModal} />
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
      <RouteList />
    </section>
  );
};

export default Route;
