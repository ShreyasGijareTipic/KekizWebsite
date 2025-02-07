import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CSpinner
} from '@coreui/react'
import { getAPICall } from '../../../util/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../common/toast/ToastContext';

const SalesReport = () => {
  const navigate = useNavigate()
  const [Sales, setSales] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalRemaining, setTotalRemaining] = useState(0)
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast();

  const [state, setState] = useState({
    start_date: '',
    end_date: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setState({ ...state, [name]: value })
  }

  const fetchSales = async () => {
    try {
      setLoading(true)
      const resp = await getAPICall(
        '/api/reportSales?startDate=' + state.start_date + '&endDate=' + state.end_date,
      )
      if (resp) {
        const groupedSales = resp.reduce((acc, sale) => {
          // Ensure proper conversion of values to numbers
          const totalAmount = parseFloat(sale.total_amount) || 0;  // Default to 0 if NaN
          const paidAmount = parseFloat(sale.paid_amount) || 0;  // Default to 0 if NaN

          if (!acc[sale.invoiceDate]) {
            acc[sale.invoiceDate] = {
              invoiceDate: sale.invoiceDate,
              totalAmount: 0,
              paidAmount: 0,
            }
          }

          acc[sale.invoiceDate].totalAmount += totalAmount
          acc[sale.invoiceDate].paidAmount += paidAmount

          return acc
        }, {})

        const salesArray = Object.values(groupedSales).map(sale => ({
          ...sale,
          totalAmount: Math.round(sale.totalAmount),  // Round numbers to integers
          paidAmount: Math.round(sale.paidAmount),  // Round numbers to integers
          remainingAmount: Math.round(sale.totalAmount - sale.paidAmount)  // Round numbers to integers
        }))

        setSales(salesArray)

        const totalSales = salesArray.reduce((acc, current) => acc + current.totalAmount, 0)
        const totalPaid = salesArray.reduce((acc, current) => acc + current.paidAmount, 0)
        const totalRemaining = salesArray.reduce((acc, current) => acc + current.remainingAmount, 0)

        setTotalSales(Math.round(totalSales))  // Round numbers to integers
        setTotalPaid(Math.round(totalPaid))  // Round numbers to integers
        setTotalRemaining(Math.round(totalRemaining))  // Round numbers to integers
      } else {
        showToast('danger', 'Failed to fetch records');
      }
    } catch (error) {
      showToast('danger', 'Error occurred ' + error);
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    try {
      const form = event.currentTarget
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      if (form.checkValidity()) {
        if (state.end_date < state.start_date) {
          showToast('danger', 'End date cannot be earlier than start date.');
          return;
        }
        await fetchSales()
      }
    } catch (e) {
      showToast('danger', 'Failed to fetch records' + e);
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Sales Report</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit} noValidate validated={validated}>
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-1">
                    <CFormLabel htmlFor="start_date">Start Date</CFormLabel>
                    <CFormInput
                      type="date"
                      id="start_date"
                      name="start_date"
                      value={state.start_date}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select date."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-1">
                    <CFormLabel htmlFor="end_date">End Date</CFormLabel>
                    <CFormInput
                      type="date"
                      id="end_date"
                      name="end_date"
                      value={state.end_date}
                      onChange={handleChange}
                      required
                      feedbackInvalid="Please select date."
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-1 mt-4">
                    <CButton color="success" type="submit">
                      Submit
                    </CButton>
                  </div>
                </div>
              </div>
            </CForm>
            <hr />
            <div className='table-responsive'>
              {loading ? (
                <CSpinner color="primary" />
              ) : (
                <CTable>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Invoice Date</CTableHeaderCell>
                      <CTableHeaderCell>Total Amount</CTableHeaderCell>
                      <CTableHeaderCell>Paid Amount</CTableHeaderCell>
                      <CTableHeaderCell>Remaining Amount</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {Sales.map((sale, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell>{sale.invoiceDate}</CTableDataCell>
                        <CTableDataCell>{sale.totalAmount}</CTableDataCell>
                        <CTableDataCell>{sale.paidAmount}</CTableDataCell>
                        <CTableDataCell>{sale.remainingAmount}</CTableDataCell>
                      </CTableRow>
                    ))}
                    <CTableRow>
                      <CTableHeaderCell>Total</CTableHeaderCell>
                      <CTableHeaderCell>{totalSales}</CTableHeaderCell>
                      <CTableHeaderCell>
                        <CBadge color="success">{totalPaid}</CBadge>
                      </CTableHeaderCell>
                      <CTableHeaderCell>
                        <CBadge color="danger">{totalRemaining}</CBadge>
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SalesReport
