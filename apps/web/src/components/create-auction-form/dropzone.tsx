import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const Dropzone = ({ onDrop, label }: { onDrop: (files: File[]) => void; label: string }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name);
    }
    onDrop(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      style={{ border: '2px dashed #ff763b', padding: '32px', textAlign: 'center' }}
    >
      <input {...getInputProps()} />
      <p>{label}</p>
      {fileName && <p>Selected file: {fileName}</p>}
    </div>
  );
};
