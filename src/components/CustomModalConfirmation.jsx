import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const ConfirmationModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 shadow-lg text-center w-80'>
        <FaCheckCircle className='text-6xl mt-7 mx-auto text-green-500 mb-4' />
        <h2 className='text-xl font-semibold mb-5'>Success</h2>
        <p className='mb-6 text-gray-600'>
          {message || "Apakah Anda yakin ingin meng-update data ini?"}
        </p>

        <button
          onClick={onClose}
          className='bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none transition duration-300'
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
