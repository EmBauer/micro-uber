import { useState } from 'react';
import Modal from 'react-modal';

const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<string>(null)
    const [content, setContent] = useState<string>(null)

    Modal.setAppElement('#root');
    const openModal = () => {
        setIsOpen(true);
        console.log("Opened modal")
    }
    const closeModal = () => setIsOpen(false);

    const ModalComponent = () => (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    zIndex: 1000
                },
                content: {
                    color: 'black',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px',
                    maxWidth: '400px',
                    margin: 'auto',
                    maxHeight: '200px',
                    borderRadius: '10px',
                    textAlign: 'center',
                },
            }}
        >
            <h2 className="text-2xl font-semibold text-primary">{title}</h2>
            <p>{content}</p>
            <button className="hover:bg-primary" onClick={closeModal}>Close</button>
        </Modal>
    );

    return {
        openModal,
        setTitle,
        setContent,
        ModalComponent
    };
};

export default useModal;