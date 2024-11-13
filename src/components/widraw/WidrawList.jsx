import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Pagination } from "@nextui-org/react";
import {
  aproveOrRejectWidraw,
  fetchWidraw,
} from "../../redux/feature/widrawSlice";
import CustomButton from "../CustomButton";

const WidrawList = () => {
  const dispatch = useDispatch();
  const { widraws, paging } = useSelector((state) => state.widraw);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [searchByName, setSearchByName] = useState("");
  const [selectedWidrawId, setSelectedWidrawId] = useState(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure(false);
  const [message, setMessage] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const handleChangePagination = (page) => {
    setPage(page);
  };

  const handleApproveWidraw = () => {
    if (selectedWidrawId) {
      dispatch(aproveOrRejectWidraw({ id: selectedWidrawId, approved: true }));
      setSelectedWidrawId(null);
      setIsApproved(false);
      dispatch(fetchWidraw({ status, page, size }));
      onClose();
    }
  };

  const openModalForRejectedWidraw = ({ id, nominal, currentDeposit }) => {
    if (nominal > currentDeposit) {
      setMessage(
        `Nominal penarikan Rp. ${nominal.toLocaleString(
          "id-ID"
        )}  melebihi saldo saat ini Rp. ${currentDeposit.toLocaleString(
          "id-ID"
        )}`
      );
    } else if (nominal === currentDeposit) {
      setMessage("");
    } else {
      setMessage("");
    }
    setSelectedWidrawId(id);
    onOpen();
  };
  const openModalForApprovedWidraw = ({ id, nominal, currentDeposit }) => {
    setMessage(
      `Nominal penarikan Rp. ${nominal.toLocaleString(
        "id-ID"
      )}, Sisa setelah penarikan Rp. ${(
        currentDeposit - nominal
      ).toLocaleString("id-ID")}`
    );
    setIsApproved(true);
    setSelectedWidrawId(id);
    onOpen();
  };

  const handleRejectWidraw = () => {
    if (selectedWidrawId) {
      dispatch(
        aproveOrRejectWidraw({ id: selectedWidrawId, approved: false, message })
      );
      setIsApproved(false);
      setSelectedWidrawId(null);
      dispatch(fetchWidraw({ status, page, size }));
      onClose();
    }
  };

  useEffect(() => {
    dispatch(fetchWidraw({ status, page, size }));
  }, []);

  useEffect(() => {
    dispatch(fetchWidraw({ status, page, size, searchByName }));
  }, [status, page, size, searchByName]);

  return (
    <section>
      <section className="flex gap-3 mb-3">
        <Input
          className="mb-3"
          label="Search by Tour Guide Name"
          variant="bordered"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
        />
        <Select
          label="Status Widraw"
          variant="bordered"
          value={status}
          onChange={(e) => setStatus(e.target.value)}>
          <SelectItem value="" key={"all"}>
            All
          </SelectItem>
          <SelectItem value="PENDING" key={"pending"}>
            Pending
          </SelectItem>
          <SelectItem value="IN" key={"in"}>
            In
          </SelectItem>
          <SelectItem value="OUT" key={"out"}>
            Out
          </SelectItem>
          <SelectItem value="REJECTED" key={"rejected"}>
            Rejected
          </SelectItem>
        </Select>
      </section>
      <Card className="flex flex-row justify-between items-center mb-3">
        <CardBody className="flex bg-mainSoil text-white flex-row justify-between">
          <section className="flex gap-4 px-6">
            <p className="w-[270px] font-bold text-md">Tour Guide Name</p>
            <p className="w-[200px] font-bold text-md">Status</p>
            <p className="w-[160px] font-bold text-md">Nominal</p>
            <p className="w-[150px] font-bold text-md">Description</p>
          </section>
          <p className="w-[150px] font-bold text-md">Action</p>
        </CardBody>
      </Card>
      {widraws.length === 0 && (
        <section className="flex justify-center items-center">
          <p className="text-center text-2xl text-zinc-500 font-bold">
            No Withdraw
          </p>
        </section>
      )}
      {widraws.map((widraw) => (
        <Card key={widraw.id} className="mb-3">
          <CardBody className="flex flex-row justify-between">
            <section className="flex gap-4 px-6 justify-center items-center">
              <p className="font-medium w-[200px]">{widraw.tourGuideName}</p>
              <p
                className={
                  {
                    OUT: "bg-successful text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                    REJECTED:
                      "bg-error text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                    PENDING:
                      "bg-purple-600 text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                    IN: "bg-blue-600 text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                  }[widraw.status]
                }>
                {widraw.status}
              </p>
              <p className="ml-16 font-medium w-[150px]">
                Rp. {widraw.nominal.toLocaleString("id-ID")}
              </p>
              <p className="w-auto ml-4 font-medium">{widraw.description}</p>
            </section>
            <section className="flex gap-4 px-6">
              {widraw.status === "PENDING" && (
                <section className="flex gap-4">
                  <CustomButton
                    customStyles={"bg-error"}
                    onPress={() => {
                      openModalForRejectedWidraw(widraw);
                    }}
                    text="Reject">
                    Reject
                  </CustomButton>
                  {widraw.nominal <= widraw.currentDeposit && (
                    <CustomButton
                      customStyles={"bg-success"}
                      onPress={() => {
                        openModalForApprovedWidraw(widraw);
                      }}
                      text="Approve">
                      Approve
                    </CustomButton>
                  )}
                </section>
              )}
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setIsApproved(false);
          setMessage("");
          onClose();
        }}
        className="verflow-scroll">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isApproved ? "Approve" : "Reject"} Widraw
              </ModalHeader>
              <ModalBody>
                {isApproved ? (
                  <>
                    <p>Yakin ingin menyetujui penarikan ini?</p>
                    <p>{message}</p>
                  </>
                ) : (
                  <>
                    <p>Yakin ingin menolak penarikan ini?</p>
                    <Textarea
                      label="Alasan penolakan"
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {isApproved ? (
                  <Button
                    color="success"
                    variant="light"
                    onPress={handleApproveWidraw}>
                    Approve
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleRejectWidraw}>
                    Reject
                  </Button>
                )}
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setIsApproved(false);
                    setSelectedWidrawId(null);
                    setMessage("");
                  }}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default WidrawList;
