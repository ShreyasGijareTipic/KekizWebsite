import React, { useState, useEffect } from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CButton, CFormLabel, CFormInput } from '@coreui/react';

const EditModal = ({ visible, setVisible, size, onSave }) => {
  const [updatedSize, setUpdatedSize] = useState(size);

  useEffect(() => {
    setUpdatedSize(size); // Sync modal data with the size to be edited
  }, [size]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSize((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave(updatedSize); // Trigger save callback with updated data
  };

  return (
    <CModal visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader>Edit Size</CModalHeader>
      <CModalBody>
        <CFormLabel htmlFor="size">Size</CFormLabel>
        <CFormInput
          id="size"
          name="size"
          value={updatedSize?.size || ''}
          onChange={handleChange}
          placeholder="Enter size"
        />
        <CFormLabel htmlFor="quantity" className="mt-3">Quantity</CFormLabel>
        <CFormInput
          id="quantity"
          name="quantity"
          value={updatedSize?.quantity || ''}
          onChange={handleChange}
          type="number"
          placeholder="Enter quantity"
        />
        <CFormLabel htmlFor="sellingPrice" className="mt-3">Selling Price</CFormLabel>
        <CFormInput
          id="sellingPrice"
          name="sellingPrice"
          value={updatedSize?.sellingPrice || ''}
          onChange={handleChange}
          type="number"
          placeholder="Enter selling price"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleSave}>Save</CButton>
        <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default EditModal;
