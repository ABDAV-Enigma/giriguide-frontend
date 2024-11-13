import FormMountain from "../../components/mountains/FormMountain";
import MountainList from "../../components/mountains/MountainList";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import CustomButton from "../../components/CustomButton";
import { fetchMountain } from "../../redux/feature/mountainSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Mountain = ({ active = "/mountain" }) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure(false);
  const [navbarActive, setNavbarActive] = useState(active || "/dashboard");
  const [searchMountain, setSearchMountain] = useState("");
  const dispatch = useDispatch();

  // Search
  // const handleSearch = (e) => {
  //   setSearchMountain(e.target.value);
  // };

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(fetchMountain({ search: searchMountain, page: 1, size: 12 }));
  // };

  useEffect(() => {
    if (active) {
      setNavbarActive(active);
    }
  }, [active]);
  useEffect(() => {
    dispatch(fetchMountain({ page: 1, size: 12, search: searchMountain }));
  }, [searchMountain]);
  return (
    <section className="font-inter h-full">
      <h1 className="mb-5 text-3xl font-bold text-mainSoil">
        Mountain Management
      </h1>

      <div className="flex justify-end gap-4 mr-28">
        <form>
          {navbarActive === "/mountain" && (
            <input
              type="search"
              className="w-full border border-zinc-400 p-2 rounded-lg text-zinc-950"
              placeholder="Search Mountain Name"
              value={searchMountain}
              onChange={(e) => setSearchMountain(e.target.value)}
            />
          )}
        </form>
        <CustomButton customStyles={"w-[200px] border-b-4"} onClick={onOpen}>
          Add Mountain
        </CustomButton>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="h-4/5 overflow-scroll">
        <ModalContent>
          {(closeModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Mountain
              </ModalHeader>
              <ModalBody>
                <FormMountain onClose={closeModal} formInput={true} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <MountainList />
    </section>
  );
};

export default Mountain;
