import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransaction,
  fetchTransactionById,
} from "../../redux/feature/transactionSlice";

import {
  Card,
  CardBody,
  Pagination,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import CustomModal from "../CustomModal";
import TransactionDetails from "./TransactionDetails";

const TransactionList = () => {
  const { transactions, paging } = useSelector((state) => state.transaction);
  const [transactionStatus, setTransactionStatus] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const dispatch = useDispatch();

  const handleChangePagination = (page) => {
    setPage(page);
  };
  useEffect(() => {
    dispatch(fetchTransaction({ page, size, status: transactionStatus }));
  }, []);

  useEffect(() => {
    dispatch(fetchTransaction({ page, size, status: transactionStatus }));
  }, [transactionStatus, page, size, dispatch]);

  const statusOptions = [
    { value: "", label: "All" },
    {
      value: "WAITING_APPROVE",
      label: "WAITING_APPROVE",
    },
    { value: "UPCOMING", label: "UPCOMING" },
    { value: "WAITING_PAY", label: "WAITING_PAY" },
    { value: "DONE", label: "DONE" },
    { value: "REJECTED", label: "REJECTED" },
  ];

  return (
    <section className="flex flex-col gap-4">
      <CustomModal
        isOpen={isOpen}
        onClose={onClose}
        content={
          <>
            <TransactionDetails />
          </>
        }
        title="Transaction Details"
        primaryActionText={"Close"}
        onPrimaryAction={onClose}
      />
      <Select
        value={transactionStatus}
        onChange={(e) => setTransactionStatus(e.target.value)}
        variant="bordered"
        bordered
        label="Status">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      <Card className="">
        <CardBody className="flex bg-mainSoil text-white flex-row justify-between">
          <section className="flex gap-4 px-6">
            <p className="w-[200px] font-bold text-md">Tour Guide Name</p>
            <p className="w-[258px] font-bold text-md">Customer Name</p>
            <p className="w-[200px] font-bold text-md">Status</p>
            <p className="w-[150px] font-bold text-md">Nama Gunung</p>
          </section>
          <p className="w-[150px] font-bold text-md">Action</p>
        </CardBody>
      </Card>
      {transactions.length === 0 && (
        <section className="flex justify-center items-center">
          <p className="text-center text-2xl text-zinc-500 font-bold">
            No Transaction
          </p>
        </section>
      )}
      {transactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardBody>
            <section className="flex justify-between gap-4 px-6 items-center">
              <section className="flex gap-4 items-center">
                <p className="w-[200px] font-medium text-md">
                  {transaction.tourGuideName}
                </p>
                <p className="w-[180px] font-medium text-md">
                  {transaction.customerName}
                </p>
                <p
                  className={
                    {
                      WAITING_APPROVE:
                        "bg-warning text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                      DONE: "bg-successful text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                      REJECTED:
                        "bg-error text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                      WAITING_PAY:
                        "bg-purple-600 text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                      UPCOMING:
                        "bg-blue-600 text-white font-bold px-6 py-2 rounded-lg w-[200px] flex justify-center items-center h-10",
                    }[transaction.transactionStatus]
                  }>
                  {transaction.transactionStatus}
                </p>
                <p className="ml-20 font-medium">{transaction.mountainName}</p>
              </section>
              <button
                className="mr-12 bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-6 border-b-4 border-blue-700 hover:border-blue-500 rounded-md"
                onClick={() => {
                  dispatch(fetchTransactionById(transaction.id));
                  onOpen();
                }}>
                Detail
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

export default TransactionList;
