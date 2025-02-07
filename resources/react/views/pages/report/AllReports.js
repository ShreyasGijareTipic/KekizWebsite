import {
  CButton,
  CFormSelect,
  CTabs,
  CTabList,
  CTabPanel,
  CTabContent,
  CTab,
} from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { Year, Custom, Months, Quarter, Week } from './Dates';
import { getAPICall } from '../../../util/api';
import All_Tables from './AllTables';
import { Button, Dropdown } from '/resources/react/views/pages/report/ButtonDropdowns';
import { MantineProvider } from '@mantine/core';
import { useToast } from '../../common/toast/ToastContext';

function All_Reports() {
  const [selectedOption, setSelectedOption] = useState('3'); // Default: Profit & Loss
  const [stateCustom, setStateCustom] = useState({ start_date: '', end_date: '' });
  const [stateMonth, setStateMonth] = useState({ start_date: '', end_date: '' });
  const [stateQuarter, setStateQuarter] = useState({ start_date: '', end_date: '' });
  const [stateYear, setStateYear] = useState({ start_date: '', end_date: '' });
  const [stateWeek, setStateWeek] = useState({ start_date: '', end_date: '' });
  const [activeTab1, setActiveTab] = useState('Year');
  const { showToast } = useToast();

  const ReportOptions = [
    { label: 'Sales', value: '1' },
    { label: 'Expense', value: '2' },
    { label: 'Profit & Loss', value: '3' },
  ];

  const [salesData, setSalesData] = useState({ data: [] });
  const [expenseData, setExpenseData] = useState({ data: [] });
  const [pnlData, setPnLData] = useState({ data: [] });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const fetchReportData = async () => {
    try {
      let date = {};
      switch (activeTab1) {
        case 'Custom': date = stateCustom; break;
        case 'Month': date = stateMonth; break;
        case 'Quarter': date = stateQuarter; break;
        case 'Year': date = stateYear; break;
        case 'Week': date = stateWeek; break;
        default: break;
      }
  
      if (!date.start_date || !date.end_date) {
        showToast('warning', 'Please select valid dates before fetching data.');
        return;
      }
  
      if (selectedOption === '1') {
        const salesResponse = await getAPICall(`/api/reportSales?startDate=${date.start_date}&endDate=${date.end_date}`);
        setSalesData({ data: Array.isArray(salesResponse?.data) ? salesResponse.data : [] });
        showToast('success', 'Sales data fetched successfully.');
      }
  
      if (selectedOption === '2') {
        const expenseResponse = await getAPICall(`/api/expense?startDate=${date.start_date}&endDate=${date.end_date}`);
        setExpenseData({ data: Array.isArray(expenseResponse) ? expenseResponse : [] });
        showToast('success', 'Expense data fetched successfully.');
      }
  
      if (selectedOption === '3') {
        const pnlResponse = await getAPICall(`/api/profit-loss?startDate=${date.start_date}&endDate=${date.end_date}`);
        setPnLData({ data: Array.isArray(pnlResponse) ? pnlResponse : [] });
        showToast('success', 'Profit & Loss data fetched successfully.');
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error.message);
    }
  };
  

  // ✅ Auto-fetch data when selectedOption or activeTab1 changes
  useEffect(() => {
    fetchReportData();
  }, [activeTab1]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <CTabs activeItemKey={activeTab1} onChange={handleTabChange}>
        <CTabList variant="tabs">
          <CTab itemKey="Year">Year</CTab>
          <CTab itemKey="Quarter">Quarter</CTab>
          <CTab itemKey="Month">Month</CTab>
          <CTab itemKey="Week">Week</CTab>
          <CTab itemKey="Custom">Custom</CTab>
        </CTabList>
        <CTabContent>
          {["Custom", "Week", "Month", "Quarter", "Year"].map((tab) => (
            <CTabPanel className="p-3" itemKey={tab} key={tab}>
              <div className="d-flex mb-3 justify-content-between">
                {tab === "Custom" && <Custom setStateCustom={setStateCustom} />}
                {tab === "Week" && <Week setStateWeek={setStateWeek} />}
                {tab === "Month" && <Months setStateMonth={setStateMonth} />}
                {tab === "Quarter" && <Quarter setStateQuarter={setStateQuarter} />}
                {tab === "Year" && <Year setStateYear={setStateYear} />}
                <Dropdown setSelectedOption={setSelectedOption} ReportOptions={ReportOptions} selectedOption={selectedOption} />
                <Button fetchReportData={fetchReportData} />
              </div>
              <All_Tables selectedOption={selectedOption} salesData={salesData} expenseData={expenseData} pnlData={pnlData} />
            </CTabPanel>
          ))}
        </CTabContent>
      </CTabs>
    </MantineProvider>
  );
}

export default All_Reports;
