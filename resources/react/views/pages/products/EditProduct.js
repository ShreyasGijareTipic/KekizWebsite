import React, { useEffect, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow
} from '@coreui/react';
import { getAPICall, put } from '../../../util/api';
import { useParams } from 'react-router-dom';
import { useToast } from '../../common/toast/ToastContext';

const EditProduct = () => {
  const params = useParams();
  const { showToast } = useToast();
  
  const [state, setState] = useState({
    id: 0,
    name: '',
    sizes: [
      {
        size: '',
        qty: 0,
        oPrice: 0,
        bPrice: 0
      }
    ]
  });

  // Predefined size options for dropdown
  const predefinedSizes = [
    { label: '500 gm', value: '500 gm' },
    { label: '1 kg', value: '1 kg' },
    { label: '2 kg', value: '2 kg' },
    { label: '5 kg', value: '5 kg' },
    // Add more size options as needed
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSizes = [...state.sizes];
    updatedSizes[index] = { ...updatedSizes[index], [name]: value };
    setState({ ...state, sizes: updatedSizes });
  };

  const removeSize = (index) => {
    if (state.sizes.length > 1) {
      const updatedSizes = state.sizes.filter((_, i) => i !== index);
      setState({ ...state, sizes: updatedSizes });
    }
  };

  const loadProductData = async () => {
    try {
      const data = await getAPICall('/api/product/' + params.id);
      setState({
        id: data.id,
        name: data.name,
        sizes: data.sizes.map(size => ({
          size: size.size,
          qty: size.qty,
          oPrice: size.oPrice,
          bPrice: size.bPrice
        }))
      });
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  useEffect(() => {
    loadProductData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Determine if the product has multiple sizes
    const multiSize = state.sizes.length > 1;

    const data = {
      name: state.name,
      multiSize: multiSize,
      sizes: state.sizes
    };

    try {
      const resp = await put('/api/product/' + state.id, data); 
      if (resp?.id) {
        showToast('success', 'Product updated successfully');
      } else {
        showToast('danger', 'Error occurred, please try again later.');
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error.message);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Product</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="needs-validation" noValidate onSubmit={handleSubmit}>
              <div className="row mb-2">
                <div className="col-6">
                  <CFormLabel htmlFor="pname">Product Name</CFormLabel>
                  <CFormInput
                    type="text"
                    id="pname"
                    placeholder="Product Name"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Product name is required</div>
                </div>
              </div>

              {/* Size, Quantity, and Price Section */}
              {state.sizes.map((size, index) => (
                <div key={index} className="row mb-2">
                  <div className="col-4">
                    <CFormLabel htmlFor={`size_${index}`}>Size</CFormLabel>
                    <CFormSelect
                      id={`size_${index}`}
                      name="size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(index, e)}
                      required
                    >
                      <option value="">Select Size</option>
                      {predefinedSizes.map((option, i) => (
                        <option key={i} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div className="col-4">
                    <CFormLabel htmlFor={`qty_${index}`}>Quantity</CFormLabel>
                    <CFormInput
                      type="number"
                      id={`qty_${index}`}
                      placeholder="0"
                      min="1"
                      name="qty"
                      value={size.qty}
                      onChange={(e) => handleSizeChange(index, e)}
                      required
                    />
                  </div>

                  <div className="col-4">
                    <CFormLabel htmlFor={`oPrice_${index}`}>Selling Price</CFormLabel>
                    <CFormInput
                      type="number"
                      id={`oPrice_${index}`}
                      placeholder="0"
                      min="1"
                      name="oPrice"
                      value={size.oPrice}
                      onChange={(e) => handleSizeChange(index, e)}
                      required
                    />
                  </div>

                  <div className="col-12 mt-2">
                    {state.sizes.length > 1 && (
                      <CButton color="danger" onClick={() => removeSize(index)}>-</CButton>
                    )}
                  </div>
                </div>
              ))}
              {/* End Size, Quantity, and Price Section */}

              <div className="mb-3">
                <CButton color="success" type="submit">
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default EditProduct;
