import React, { useState } from 'react';
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CForm,CFormLabel, CFormInput } from '@coreui/react';
import { useTranslation } from 'react-i18next';

export default function CustomProductModal({ visible, setVisible, onAddProduct }) {
  const { t } = useTranslation("global");
  const [customProduct, setCustomProduct] = useState({ name: '', size: '', price: 0, qty: 0 });

  const handleAddProduct = () => {
    if (customProduct.name && customProduct.size && customProduct.price > 0 && customProduct.qty > 0) {
      onAddProduct({ ...customProduct, id: Date.now(), total: customProduct.qty * customProduct.price });
      setCustomProduct({ name: '', size: '', price: 0, qty: 0 });
      setVisible(false);
    } else {
      alert(t('LABELS.fill_all_fields')); // Replace with a toast or alert dialog as per your UI
    }
  };

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="CustomProductModalLabel"
    >
      <CModalHeader>
        <CModalTitle id="CustomProductModalLabel">{t("LABELS.customize_product")}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>{t('LABELS.product_name')}</CFormLabel>
          <CFormInput

            type="text"
            placeholder={t("LABELS.product_name")}
            value={customProduct.name}
            onChange={(e) => setCustomProduct({ ...customProduct, name: e.target.value })}
            className="mb-3"
          />
          <CFormLabel>{t('LABELS.product_size')}</CFormLabel>
          <CFormInput
            type="text"
            placeholder={t("LABELS.size")}
            value={customProduct.size}
            onChange={(e) => setCustomProduct({ ...customProduct, size: e.target.value })}
            className="mb-3"
          />
          <CFormLabel>{t('LABELS.product_price')}</CFormLabel>
          <CFormInput
            type="number"
            placeholder={t("LABELS.price")}
            value={customProduct.price}
            onChange={(e) => setCustomProduct({ ...customProduct, price: parseFloat(e.target.value) })}
            className="mb-3"
          />
          <CFormLabel>{t('LABELS.quantity')}</CFormLabel>
          <CFormInput
            type="number"
            placeholder={t("LABELS.quantity")}
            value={customProduct.qty}
            onChange={(e) => setCustomProduct({ ...customProduct, qty: parseInt(e.target.value, 10) })}
            className="mb-3"
          />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          {t("LABELS.close")}
        </CButton>
        <CButton color="primary" onClick={handleAddProduct}>
          {t("LABELS.add")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
