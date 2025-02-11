import {
  CFormSelect,
} from '@coreui/react';
import React, { useState, useEffect } from 'react';
import { Year, Custom, Months, Quarter, Week } from './Dates';
import { getAPICall } from '../../../util/api';
import All_Tables from './AllTables';
import { Button } from '/resources/react/views/pages/report/ButtonDropdowns';
import { MantineProvider, Grid, Card, Tabs, SegmentedControl, Paper, Stack } from '@mantine/core';
import { useToast } from '../../common/toast/ToastContext';

function All_Reports() {
  const [selectedOption, setSelectedOption] = useState('3'); // Default: Profit & Loss
  const [activeTab1, setActiveTab] = useState('Year');
  const { showToast } = useToast();

  const [stateCustom, setStateCustom] = useState({ start_date: '', end_date: '' });
  const [stateMonth, setStateMonth] = useState({ year: '', month: '' });
  const [stateQuarter, setStateQuarter] = useState({ year: '', quarter: '' });
  const [stateYear, setStateYear] = useState({ year: '' });
  const [stateWeek, setStateWeek] = useState({ start_date: '', end_date: '' });

  const ReportOptions = [
    { label: 'Sales', value: '1' },
    { label: 'Expense', value: '2' },
    { label: 'Profit & Loss', value: '3' },
  ];

  const [salesData, setSalesData] = useState({ data: [] });
  const [expenseData, setExpenseData] = useState({ data: [] });
  const [pnlData, setPnLData] = useState({ data: [] });

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

      if ((!date.start_date || !date.end_date) && activeTab1 !== 'Year' && activeTab1 !== 'Month' && activeTab1 !== 'Quarter') {
        showToast('warning', 'Please select valid dates before fetching data.');
        return;
      }

      const userData = JSON.parse(localStorage.getItem("userData"));
      const company_id = userData ? userData?.user.company_id : null;

      if (selectedOption === '1') {
        const salesResponse = await getAPICall(`/api/reportSales?startDate=${date.start_date}&endDate=${date.end_date}&company_id=${company_id}`);
        setSalesData({ data: Array.isArray(salesResponse?.data) ? salesResponse.data : [] });
        
      }
      if (selectedOption === '2') {
        const expenseResponse = await getAPICall(`/api/expense?startDate=${date.start_date}&endDate=${date.end_date}&company_id=${company_id}`);
        setExpenseData({ data: Array.isArray(expenseResponse) ? expenseResponse : [] });
        
      }
      if (selectedOption === '3') {
        const pnlResponse = await getAPICall(`/api/profit-loss?startDate=${date.start_date}&endDate=${date.end_date}&company_id=${company_id}`);
        setPnLData({ data: Array.isArray(pnlResponse) ? pnlResponse : [] });
        
      }
    } catch (error) {
      showToast('danger', 'Error occurred: ' + error.message);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [activeTab1]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS
      theme={{
        components: {
          DatePicker: {
            styles: { dropdown: { zIndex: 1000 } }
          }
        }
      }}
    >
      <Stack spacing="md" p="lg">
       
        {/* Date Selection */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ overflow: 'visible' }}>
          <Tabs value={activeTab1} onTabChange={setActiveTab}>
            <Tabs.List grow>
              <Tabs.Tab value="Year">Year</Tabs.Tab>
              <Tabs.Tab value="Quarter">Quarter</Tabs.Tab>
              <Tabs.Tab value="Month">Month</Tabs.Tab>
              <Tabs.Tab value="Week">Week</Tabs.Tab>
              <Tabs.Tab value="Custom">Custom</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Year">
              <Year setStateYear={setStateYear} withinPortal />
            </Tabs.Panel>
            <Tabs.Panel value="Quarter">
              <Quarter setStateQuarter={setStateQuarter} withinPortal />
            </Tabs.Panel>
            <Tabs.Panel value="Month">
              <Months setStateMonth={setStateMonth} withinPortal />
            </Tabs.Panel>
            <Tabs.Panel value="Week">
              <Week setStateWeek={setStateWeek} withinPortal />
            </Tabs.Panel>
            <Tabs.Panel value="Custom">
              <Custom setStateCustom={setStateCustom} withinPortal />
            </Tabs.Panel>
          </Tabs>
        </Card>

        {/* Report Type Selection */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Grid gutter="md" align="center">
            <Grid.Col span={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
              <SegmentedControl
                data={ReportOptions}
                value={selectedOption}
                onChange={setSelectedOption}
                fullWidth
              />
            </Grid.Col>
            <Grid.Col span={12} md={6} style={{ textAlign: 'center' }}>
              <Button fetchReportData={fetchReportData} />
            </Grid.Col>
          </Grid>
        </Card>

        {/* Tables Always Visible */}
        <Paper shadow="sm" padding="lg" radius="md" withBorder>
          <All_Tables selectedOption={selectedOption} salesData={salesData} expenseData={expenseData} pnlData={pnlData} />
        </Paper>
      </Stack>
    </MantineProvider>
  );
}

export default All_Reports;
