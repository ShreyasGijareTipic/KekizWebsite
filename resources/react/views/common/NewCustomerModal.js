import React, { useEffect, useState } from 'react';
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';
import { getUserData } from '../../util/session';
import { post } from '../../util/api';
import { useToast } from '../common/toast/ToastContext';
import { useTranslation } from 'react-i18next';

export default function NewCustomerModal({ visible, hint, setVisible, onSuccess }) {
  const user = getUserData(); // Fetch user session details
  const { showToast } = useToast();
  const { t } = useTranslation('global');

  // Initialize state
  const [state, setState] = useState({
    name: '',
    mobile: '',
    birthdate: '',
    anniversary_date: '',
    discount: 0,
    company_id: user?.company_id || '',
    show: true,
  });

  // Prefill fields based on `hint` when modal opens
  useEffect(() => {
    if (visible) {
      const regex = /^\d+$/; // Check if hint is numeric (mobile number)
      setState((prevState) => ({
        ...prevState,
        name: regex.test(hint?.trim()) ? '' : hint?.trim(),
        mobile: regex.test(hint?.trim()) ? hint?.trim() : '',
      }));
    }
  }, [hint, visible]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Clear the form
  const handleClear = () => {
    setState({
      name: '',
      mobile: '',
      birthdate: '',
      anniversary_date: '',
      discount: 0,
      company_id: user?.company_id || '',
      show: true,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Check form validity
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Prepare data for submission
    const data = { ...state };

    try {
      const resp = await post('/api/customer', data); // API call
      if (resp?.id) {
        showToast('success', t('MSG.data_saved_successfully_msg'));
        onSuccess(resp); // Callback with new customer data
        setVisible(false);
        handleClear();
      } else {
        showToast('danger', t('MSG.failed_to_create'));
      }
    } catch (error) {
      showToast('danger', `Error occurred: ${error.message || error}`);
    }
  };

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => {
        handleClear();
        setVisible(false);
      }}
    >
      <CModalHeader>
        <CModalTitle>{t('LABELS.new_customer')}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm className="needs-validation" noValidate onSubmit={handleSubmit}>
          {/* Customer Name */}
          <div className="mb-3">
            <CFormLabel>{t('LABELS.customer_name')}</CFormLabel>
            <CFormInput
              type="text"
              name="name"
              placeholder={t('MSG.enter_customer_name_msg')}
              value={state.name}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{t('MSG.name_is_required_msg')}</div>
          </div>

          {/* Mobile Number */}
          <div className="mb-3">
            <CFormLabel>{t('LABELS.mobile_number')}</CFormLabel>
            <CFormInput
              type="tel" // Use 'tel' instead of 'number' for better mobile number handling
              name="mobile"
              placeholder={t('MSG.enter_mob_no_msg')}
              value={state.mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                if (value.length <= 10) {
                  handleChange({ target: { name: 'mobile', value } });
                }
              }}
              maxLength={10} // Prevents input beyond 10 characters
              pattern="\d{10}" // Ensures exactly 10 digits for form validation
              required
            />
            <div className="invalid-feedback">{t('MSG.mobile_number_is_required_msg')}</div>
          </div>


          {/* Birthdate */}
          <div className="mb-3">
            <CFormLabel>{t('LABELS.birthdate')}</CFormLabel>
            <CFormInput
              type="date"
              name="birthdate"
              value={state.birthdate}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">{t('MSG.birthdate_is_required_msg')}</div>
          </div>

          {/* Anniversary Date */}
          <div className="mb-3">
            <CFormLabel>{t('LABELS.anniversary_date')}</CFormLabel>
            <CFormInput
              type="date"
              name="anniversary_date"
              value={state.anniversary_date}
              onChange={handleChange}
            />
          </div>

          {/* Submit and Close Buttons */}
          <div className="mb-3">
            <CButton color="success" type="submit">
              {t('LABELS.submit')}
            </CButton>
            &nbsp;
            <CButton
              color="danger"
              type="button"
              onClick={() => {
                handleClear();
                setVisible(false);
              }}
            >
              {t('LABELS.close')}
            </CButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>
  );
}
