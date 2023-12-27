'use client';

import Modal from 'react-modal';
import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
  },
};

interface Props {
  message: string;
  onClick?: () => void;
}

const ReactModal = ({ message, onClick }: Props) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    onClick();
  };

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Example Modal'>
        <h2>{message}</h2>
        <button
          type='button'
          onClick={closeModal}
          className='text-red-700 font-semibold flex items-center space-x-2'
        >
          <Icon path={mdiTrashCanOutline} size={0.8} />
          &nbsp; Confirm Delete
        </button>
      </Modal>
    </div>
  );
};

export default ReactModal;
