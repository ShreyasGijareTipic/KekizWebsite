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
  CFormTextarea,
  CRow,
} from '@coreui/react';
import { getAPICall, put } from '../../../util/api';
import { useParams } from 'react-router-dom';
import { getUserData } from '../../../util/session';
import { useToast } from '../../common/toast/ToastContext';
import { useNavigate } from 'react-router-dom';

const EditCustomer = () => {
  const params = useParams();
  const { showToast } = useToast();
  const [state, setState] = useState({
    name: '',
    mobile: '',
    discount: 0,
    company_id: 0,
    address: '',
    birthdate: '',
    anniversary_date: ''
  });
  const user = getUserData();
  const [companyList, setCompanyList] = useState([]);
    const navigate = useNavigate();
  

  // Fetch customer and company list
  useEffect(() => {
    try {
      loadCustomerData();
      getAPICall('/api/company').then((resp) => {
        if (resp) {
          const mappedList = resp.map(itm => ({ label: itm.company_name, value: itm.company_id }));
          if (user.type === 0) {
            setCompanyList(mappedList);
          } else {
            setCompanyList(mappedList.filter(e => e.value === user.company_id));
          }
        }
      });
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  }, []);

  const loadCustomerData = async () => {
    try {
      const data = await getAPICall('/api/customer/' + params.id);
      setState({
        id: data.id,
        name: data.name,
        mobile: data.mobile,
        discount: data.discount,
        company_id: data.company_id,
        address: data.address,
        birthdate: data.birthdate || '',
        anniversary_date: data.anniversary_date || ''
      });
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    let data = { ...state };
    try {
      const resp = await put('/api/customer/' + data.id, data);
      if (resp?.id) {
        showToast('success', 'Customer updated successfully');
        navigate('/customer/all');
        
      } else {
        showToast('danger', 'Error occurred, please try again later.');
      }
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    }
  };

  const handleClear = () => {
    setState({
      name: '',
      mobile: '',
      discount: 0,
      company_id: state.company_id,
      address: '',
      birthdate: '',
      anniversary_date: ''
    });
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Customer Details</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="needs-validation" noValidate onSubmit={handleSubmit}>
              {/* Customer Name */}
              <div className="mb-3">
                <CFormLabel htmlFor="pname">Customer Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="pname"
                  placeholder="Customer Name"
                  name="name"
                  value={state.name}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Name is required</div>
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <CFormLabel htmlFor="plmobile">Mobile Number</CFormLabel>
                <CFormInput
                  type="text"
                  id="plmobile"
                  placeholder="Mobile Number"
                  name="mobile"
                  value={state.mobile}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Mobile number is required</div>
              </div>
              {/* Birthdate */}
              <div className="mb-3">
                <CFormLabel htmlFor="birthdate">Birthdate</CFormLabel>
                <CFormInput
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={state.birthdate}
                  onChange={handleChange}
                />
              </div>

              {/* Anniversary Date */}
              <div className="mb-3">
                <CFormLabel htmlFor="anniversary_date">Anniversary Date</CFormLabel>
                <CFormInput
                  type="date"
                  id="anniversary_date"
                  name="anniversary_date"
                  value={state.anniversary_date}
                  onChange={handleChange}
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

export default EditCustomer;
