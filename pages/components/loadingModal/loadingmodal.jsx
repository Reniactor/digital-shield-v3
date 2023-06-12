import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";

const LoadingModal = ({ isLoading }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Modal
            show={true}
            centered
            backdrop="static"
            keyboard={false}
            dialogClassName="modal-loading"
          >
            <Modal.Body className="flex flex-col items-center">
              <Spinner animation="border" variant="primary" />
              <span className="mt-2">Loading...</span>
            </Modal.Body>
          </Modal>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-4">
            <span>Success!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingModal;
