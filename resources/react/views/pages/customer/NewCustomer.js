import React, { useEffect, useState, useCallback } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react';
import { getAPICall, post } from '../../../util/api';
import { getUserData } from '../../../util/session';
import { useToast } from '../../common/toast/ToastContext';
import { useNavigate } from 'react-router-dom';

const NewCustomer = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const user = getUserData();

  const [state, setState] = useState({
    name: '',
    mobile: '',
    birthdate: '',
    anniversary_date: '',
    discount: 0,
    company_id: user?.company_id || 0,
    show: true,
    address: '',
  });

  const [companyList, setCompanyList] = useState([]);

  // Fetch Company List
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const resp = await getAPICall('/api/company');
        if (resp?.length) {
          const mappedList = resp.map(itm => ({
            label: itm.company_name,
            value: itm.company_id,
          }));

          if (user.type === 0) {
            setCompanyList(mappedList);
            if (mappedList.length > 0) {
              setState(prev => ({ ...prev, company_id: mappedList[0].value }));
            }
          } else {
            setCompanyList(mappedList.filter(e => e.value === user.company_id));
            setState(prev => ({ ...prev, company_id: user.company_id }));
          }
        }
      } catch (error) {
        showToast('danger', 'Error occurred: ' + error);
      }
    };

    fetchCompanies();
  }, [user.type, user.company_id]);

  // Handle Input Changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCBChange = useCallback((e) => {
    const { name, checked } = e.target;
    setState(prev => ({ ...prev, [name]: checked }));
  }, []);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    try {
      const resp = await post('/api/customer', state);
      if (resp?.id) {
        showToast('success', 'Customer created successfully!');
        navigate('/usermanagement/all-users');
      } else {
        showToast('danger', 'Failed to create customer.');
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error);
    }
  };

  // Clear Form
  const handleClear = () => {
    setState({
      name: '',
      mobile: '',
      birthdate: '',
      anniversary_date: '',
      discount: 0,
      company_id: user?.company_id || 0,
      show: true,
      address: '',
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create New Customer</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="needs-validation" noValidate onSubmit={handleSubmit}>
              
              {/* Customer Name */}
              <div className="mb-3">
                <CFormLabel>Customer Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  placeholder="Enter Customer Name"
                  value={state.name}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Name is required</div>
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <CFormLabel>Mobile Number</CFormLabel>
                <CFormInput
                  type="text"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  value={state.mobile}
                  onChange={handleChange}
                  pattern="\d{10}"
                  minLength={10}
                  maxLength={10}
                  required
                />
                <div className="invalid-feedback">Valid mobile number is required</div>
              </div>

              {/* Birthdate */}
              <div className="mb-3">
                <CFormLabel>Birthdate</CFormLabel>
                <CFormInput
                  type="date"
                  name="birthdate"
                  value={state.birthdate}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Birthdate is required</div>
              </div>

              {/* Anniversary Date */}
              <div className="mb-3">
                <CFormLabel>Anniversary Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="anniversary_date"
                  value={state.anniversary_date}
                  onChange={handleChange}
                />
              </div>

              {/* Company Selection */}
              <div className="mb-3">
                <CFormLabel>Company</CFormLabel>
                <CFormSelect
                  name="company_id"
                  value={state.company_id}
                  onChange={handleChange}
                  required
                >
                  {companyList.map(company => (
                    <option key={company.value} value={company.value}>
                      {company.label}
                    </option>
                  ))}
                </CFormSelect>
                <div className="invalid-feedback">Please select a company</div>
              </div>

              {/* Address */}
              <div className="mb-3">
                <CFormLabel>Address</CFormLabel>
                <CFormTextarea
                  rows={2}
                  name="address"
                  value={state.address}
                  onChange={handleChange}
                />
              </div>

              {/* Discount */}
              <div className="mb-3">
                <CFormLabel>Special Discount (%)</CFormLabel>
                <CFormInput
                  type="number"
                  name="discount"
                  placeholder="Enter discount"
                  value={state.discount}
                  onChange={handleChange}
                />
              </div>

              {/* Show for Invoicing */}
              <div className="mb-3">
                <CFormCheck
                  label="Show for invoicing"
                  name="show"
                  checked={state.show}
                  onChange={handleCBChange}
                />
              </div>

              {/* Submit and Clear Buttons */}
              <div className="mb-3">
                <CButton color="success" type="submit">
                  Submit
                </CButton>
                &nbsp;
                <CButton color="secondary" onClick={handleClear}>
                  Clear
                </CButton>
              </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NewCustomer;
