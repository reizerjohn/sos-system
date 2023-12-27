import { clientApi } from '@app/lib/api';
import { toast } from 'react-toastify';
import Icon from '@mdi/react';
import { mdiDeleteAlert } from '@mdi/js';
import Modal from 'react-modal';
import { useClassContext } from '@app/contexts/class-context';

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  closeModal: () => void;
  onDelete: () => void;
  subjectId: number;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '15px',
  },
};

const DeleteSubjectModal = ({ isOpen, onRequestClose, closeModal, onDelete, subjectId }: Props) => {
  const { reset } = useClassContext();

  const handleSubmit = async () => {
    const body = { id: subjectId };

    try {
      const res = await clientApi.delete('subjects', { params: body });
      
      toast.success(res.data.message, {
        position: 'top-center',
      });

      reset();
    } catch (error) {
      if (error.code === 'ERR_BAD_REQUEST') {
        toast.error(error.response?.data?.message, {
          position: 'top-center',
        });
      } else {
        toast.error('Something went wrong', {
          position: 'top-center',
        });
      }
    }

    closeModal();
    onDelete();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel='Delete Class Modal'>
      <div className='w-full h-full flex items-start space-x-4'>
        <div
          className='w-fit p-2 bg-red-100 border-8 border-red-50 rounded-full
            flex items-center justify-center'
        >
          <Icon path={mdiDeleteAlert} size={1} className='text-red-600' />
        </div>
        <div className='space-y-3'>
          <div className='space-y-1 pl-2'>
            <p className='label-lg text-neutral-800'>Are you sure you want to delete this subject?</p>
            <p className='body-2 text-neutral-600'>
              You are about to delete this subject? This cannot be undone.
            </p>
          </div>
          <div className='space-x-3'>
            <button onClick={closeModal} className='text-neutral-600 font-semibold hover:bg-neutral-100 p-2 rounded-lg'>
              Cancel
            </button>
            <button onClick={handleSubmit} className='text-red-700 font-semibold hover:bg-red-100 p-2 rounded-lg'>
              Delete Subject
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteSubjectModal;