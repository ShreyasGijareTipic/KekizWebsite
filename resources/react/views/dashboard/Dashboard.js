import React, { useState, useEffect } from 'react';
import CIcon from '@coreui/icons-react';
import { cilChatBubble } from '@coreui/icons';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todays_birthdays: [],
    upcoming_birthdays: [],
    todays_anniversaries: [],
    upcoming_anniversaries: [],
  });
  const [activeTab, setActiveTab] = useState('todays_birthdays'); // Default tab

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();

        setDashboardData({
          todays_birthdays: data.todays_birthdays || [],
          upcoming_birthdays: data.upcoming_birthdays || [],
          todays_anniversaries: data.todays_anniversaries || [],
          upcoming_anniversaries: data.upcoming_anniversaries || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const sendMessage = (mobileNumber, message) => {
    // Construct SMS URL for sending the message
    window.location.href = `sms:+91${mobileNumber}?body=${message}`;
  };

  // Function to render content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'todays_birthdays':
        return (
          <div>
            {dashboardData.todays_birthdays.length > 0 ? (
              dashboardData.todays_birthdays.map((birthday, index) => (
                <div key={index}>
                  <p><strong>{birthday.name}</strong> - {birthday.birthdate}</p>
                  {birthday.relatives && birthday.relatives.length > 0 && (
                    <div>
                      <h5>Relatives:</h5>
                      {birthday.relatives.map((relative) => (
                        <div key={relative.id}>
                          <p>Relative: <strong>{relative.name}</strong> - {relative.birthdate}</p>
                          {relative.customer && (
                            <div>
                              <p>Associated Customer: <strong>{relative.customer.name}</strong></p>
                              <a
                                className="btn btn-outline-success btn-sm"
                                href={`sms:+91${relative.customer.mobile}?body=Happy Birthday, ${relative.customer.name}!`}
                              >
                                <CIcon icon={cilChatBubble} />
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <a
                    className="btn btn-outline-success btn-sm"
                    href={`sms:+91${birthday.mobile}?body=Happy Birthday, ${birthday.name}!`}
                  >
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No birthdays today.</p>
            )}
          </div>
        );
      case 'upcoming_birthdays':
        return (
          <div>
            {dashboardData.upcoming_birthdays.length > 0 ? (
              dashboardData.upcoming_birthdays.map((birthday, index) => (
                <div key={index}>
                  <p><strong>{birthday.name}</strong> - {birthday.birthdate}</p>
                  {birthday.relatives && birthday.relatives.length > 0 && (
                    <div>
                      <h5>Relatives:</h5>
                      {birthday.relatives.map((relative) => (
                        <div key={relative.id}>
                          <p>Relative: <strong>{relative.name}</strong> - {relative.birthdate}</p>
                          {relative.customer && (
                            <div>
                              <p>Associated Customer: <strong>{relative.customer.name}</strong></p>
                              <a
                                className="btn btn-outline-success btn-sm"
                                href={`sms:+91${relative.customer.mobile}?body=Happy Birthday, ${relative.customer.name}!`}
                              >
                                <CIcon icon={cilChatBubble} />
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <a
                    className="btn btn-outline-success btn-sm"
                    href={`sms:+91${birthday.mobile}?body=Happy Birthday, ${birthday.name}!`}
                  >
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No upcoming birthdays.</p>
            )}
          </div>
        );
      case 'todays_anniversaries':
        return (
          <div>
            {dashboardData.todays_anniversaries.length > 0 ? (
              dashboardData.todays_anniversaries.map((anniversary, index) => (
                <div key={index}>
                  <p><strong>{anniversary.name}</strong> ({anniversary.delivery_for}) - {anniversary.birthdate}</p>
                  <a
                    className="btn btn-outline-success btn-sm"
                    href={`sms:+91${anniversary.mobile}?body=Happy Anniversary, ${anniversary.name}!`}
                  >
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No anniversaries today.</p>
            )}
          </div>
        );
      case 'upcoming_anniversaries':
        return (
          <div>
            {dashboardData.upcoming_anniversaries.length > 0 ? (
              dashboardData.upcoming_anniversaries.map((anniversary, index) => (
                <div key={index}>
                  <p><strong>{anniversary.name}</strong> ({anniversary.delivery_for}) - {anniversary.anniversary_date}</p>
                  <a
                    className="btn btn-outline-success btn-sm"
                    href={`sms:+91${anniversary.mobile}?body=Happy Anniversary, ${anniversary.name}!`}
                  >
                    <CIcon icon={cilChatBubble} />
                  </a>
                </div>
              ))
            ) : (
              <p>No upcoming anniversaries.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => setActiveTab('todays_birthdays')}
          style={activeTab === 'todays_birthdays' ? activeTabButtonStyle : tabButtonStyle}
        >
          Today's Birthdays
        </button>
        <button
          onClick={() => setActiveTab('upcoming_birthdays')}
          style={activeTab === 'upcoming_birthdays' ? activeTabButtonStyle : tabButtonStyle}
        >
          Upcoming Birthdays
        </button>
        <button
          onClick={() => setActiveTab('todays_anniversaries')}
          style={activeTab === 'todays_anniversaries' ? activeTabButtonStyle : tabButtonStyle}
        >
          Today's Anniversaries
        </button>
        <button
          onClick={() => setActiveTab('upcoming_anniversaries')}
          style={activeTab === 'upcoming_anniversaries' ? activeTabButtonStyle : tabButtonStyle}
        >
          Upcoming Anniversaries
        </button>
      </div>

      {/* Tab Content */}
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

const tabButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const activeTabButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745', // Green for active tab
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const messageButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

export default Dashboard;
