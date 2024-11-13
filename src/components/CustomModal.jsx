import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const CustomModal = ({
  title,
  content,
  primaryActionText,
  secondaryActionText,
  onPrimaryAction,
  onSecondaryAction,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl" onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              {secondaryActionText && (
                <Button
                  color="danger"
                  variant="light"
                  onPress={onSecondaryAction || onClose}>
                  {secondaryActionText}
                </Button>
              )}
              {primaryActionText && (
                <Button color="primary" onPress={onPrimaryAction || onClose}>
                  {primaryActionText}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
