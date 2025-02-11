import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { cilBirthdayCake, cilHeart, cilChatBubble } from '@coreui/icons';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todays_birthdays: { customers: [], relatives: [] },
    todays_anniversaries: [],
    upcoming_birthdays: { customers: [], relatives: [] },
    upcoming_anniversaries: [],
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        setDashboardData({
          todays_birthdays: data.todays_birthdays || { customers: [], relatives: [] },
          todays_anniversaries: data.todays_anniversaries || [],
          upcoming_birthdays: data.upcoming_birthdays || { customers: [], relatives: [] },
          upcoming_anniversaries: data.upcoming_anniversaries || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateMessage = (event, type) => {
    return `${type === 'birthday' ? 'Happy Birthday' : 'Happy Anniversary'} ${event.name} - Team Kekiz!`;
  };

  const generateUpcomingMessage = (type, name, date) => {
    return `${type} coming on ${date}! Celebrate with ${name}. Please order quickly, we have a special discount - Team Kekiz!`;
  };

  const getMobileNumber = (event) => {
    return event.customer ? event.customer.mobile : event.mobile;
  };

  const formatName = (event) => {
    return event.relation ? `${event.relation} - ${event.customer.name}` : event.name;
  };

  const isMobile = windowWidth <= 768;

  return (
    <div style={dashboardContainer}>
      <div style={isMobile ? mobileTwoColumnGrid : twoColumnGrid}>
        <div style={cardStyle}>
          <h3>🎂 Today's Birthdays</h3>
          <div style={scrollableContent}>
            {dashboardData.todays_birthdays.customers.length > 0 || dashboardData.todays_birthdays.relatives.length > 0 ? (
              dashboardData.todays_birthdays.customers.concat(dashboardData.todays_birthdays.relatives).map((event, index) => (
                <div key={index} style={eventItem}>
                  <CIcon icon={cilBirthdayCake} style={iconStyle} />
                  <p>
                    <strong>{formatName(event)}</strong> - {event.birthdate}
                  </p>
                  <a className="btn btn-outline-success btn-sm" href={`sms:+91${getMobileNumber(event)}?body=${generateMessage(event, 'birthday')}`}>
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No birthdays today.</p>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h3>💖 Today's Anniversaries</h3>
          <div style={scrollableContent}>
            {dashboardData.todays_anniversaries.length > 0 ? (
              dashboardData.todays_anniversaries.map((event, index) => (
                <div key={index} style={eventItem}>
                  <CIcon icon={cilHeart} style={iconStyle} />
                  <p>
                    <strong>{formatName(event)}</strong> - {event.anniversary_date}
                  </p>
                  <a className="btn btn-outline-success btn-sm" href={`sms:+91${getMobileNumber(event)}?body=${generateMessage(event, 'anniversary')}`}>
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No anniversaries today.</p>
            )}
          </div>
        </div>
      </div>

      <div style={isMobile ? mobileTwoColumnGrid : twoColumnGrid}>
        <div style={cardStyle}>
          <h3>🎈 Upcoming Birthdays</h3>
          <div style={scrollableContent}>
            {dashboardData.upcoming_birthdays.customers.length > 0 || dashboardData.upcoming_birthdays.relatives.length > 0 ? (
              dashboardData.upcoming_birthdays.customers.concat(dashboardData.upcoming_birthdays.relatives).map((event, index) => (
                <div key={index} style={eventItem}>
                  <CIcon icon={cilBirthdayCake} style={iconStyle} />
                  <p><strong>{formatName(event)}</strong> - {event.birthdate}</p>
                  <a className="btn btn-outline-success btn-sm" href={`sms:+91${getMobileNumber(event)}?body=${generateUpcomingMessage('Birthday', event.name, event.birthdate)}`}>
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No upcoming birthdays.</p>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h3>✨ Upcoming Anniversaries</h3>
          <div style={scrollableContent}>
            {dashboardData.upcoming_anniversaries.length > 0 ? (
              dashboardData.upcoming_anniversaries.map((event, index) => (
                <div key={index} style={eventItem}>
                  <CIcon icon={cilHeart} style={iconStyle} />
                  <p><strong>{formatName(event)}</strong> - {event.anniversary_date}</p>
                  <a className="btn btn-outline-success btn-sm" href={`sms:+91${getMobileNumber(event)}?body=${generateUpcomingMessage('Anniversary', event.name, event.anniversary_date)}`}>
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No upcoming anniversaries.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const dashboardContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const twoColumnGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const mobileTwoColumnGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: '0.3s',
};

const eventItem = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 0',
  borderBottom: '1px solid #ddd',
};

const iconStyle = {
  fontSize: '20px',
  marginRight: '10px',
};

const scrollableContent = {
  maxHeight: '200px',
  overflowY: 'auto',
};

export default Dashboard;
