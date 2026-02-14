export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDone?: (data: FormValues) => void;
}
