import { FileUpload } from '@/pages/FileUpload';
import { Route, Routes } from 'react-router-dom';

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<FileUpload />} />
    </Routes>
  );
};

export default Routing;
