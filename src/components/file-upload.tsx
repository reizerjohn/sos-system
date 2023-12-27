/* eslint-disable max-len */
import { mdiCloudUploadOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { clientApi } from '@app/lib/api';
import { toast } from 'react-toastify';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const inputRef = useRef<any>();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    const commonConfig = { delimiter: ',' };

    Papa.parse(file, {
      ...commonConfig,
      header: true,
      complete: (result) => {
        uploadData(result.data);
      },
    });
  };

  const uploadData = async (payload) => {
    payload = payload.filter((d) => Object.keys(d).length !== 1);
    
    const hasCorrectFields = validateCsvDataFields(payload);
    console.log({ payload, hasCorrectFields });

    if (hasCorrectFields) {
      const res = await clientApi.post('users/students/import', { data: payload });

      toast.success(res.data.message, {
        position: 'bottom-right',
      });

      return;
    }

    toast.error('Invalid CSV data format', {
      position: 'bottom-right',
    });
  };

  const validateCsvDataFields = (payload = []) => {
    const fields = [
      'idNumber',
      'firstName',
      'lastName',
      'middleName',
      'gradeLevel',
      'section',
      'gender',
      'birthday',
      'address',
      'guardian',
      'dateEnrolled',
      'status',
    ];

    for (const data of payload) {
      const csvDataKeys = Object.keys(data);
      const hasAllFields = fields.every((k) => csvDataKeys.includes(k));

      if (!hasAllFields) return false;
    }

    return true;
  };

  return (
    <>
      <h1 className='text-center text-3xl mb-8'>Import Student Data</h1>
      {!file && (
        <div
          className='flex flex-col justify-center items-center border-4 border-dashed border-gray-300 p-20 mx-72 rounded-lg'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Icon path={mdiCloudUploadOutline} className='text-gray-600' size={1.5} />
          <h1 className='text-gray-600 font-semibold'>Drag and drop file to upload</h1>
          <h1 className='text-gray-600'>Or</h1>
          <input type='file' onChange={(event) => setFile(event.target.files[0])} hidden accept='.csv' ref={inputRef} />
          <button
            className='text-white bg-gray-500 hover:bg-gray-400 py-1 px-3 rounded-md mt-1'
            onClick={() => inputRef.current.click()}
          >
            Select Files
          </button>
        </div>
      )}
      {file && (
        <div className='flex flex-col justify-center items-center border-4 border-dashed border-gray-300 p-20 mx-72 rounded-lg'>
          <Icon path={mdiCloudUploadOutline} className='text-gray-600' size={1.5} />
          <h1 className='text-gray-600 font-semibold'>Upload File?</h1>
          <h1 className='text-gray-600'>{file.name}</h1>
          <div className='mt-3'>
            <button
              className='text-white bg-gray-500 hover:bg-gray-400 py-1 px-3 rounded-md m-1'
              onClick={() => setFile(null)}
            >
              Cancel
            </button>
            <button className='text-white bg-red-500 hover:bg-red-400 py-1 px-3 rounded-md m-1' onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileUpload;
