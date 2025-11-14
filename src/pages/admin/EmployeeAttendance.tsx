import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CheckCircle, XCircle, Search, Filter, Download, UserPlus } from 'lucide-react';
import "./attendance.css"

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Smith', role: 'Manager', status: 'present', checkIn: '08:45 AM', checkOut: '-', shifts: 'Morning' },
    { id: 2, name: 'Sarah Johnson', role: 'Employee', status: 'present', checkIn: '09:00 AM', checkOut: '-', shifts: 'Morning' },
    { id: 3, name: 'Mike Davis', role: 'Employee', status: 'absent', checkIn: '-', checkOut: '-', shifts: 'Evening' },
    { id: 4, name: 'Emma Wilson', role: 'Employee', status: 'present', checkIn: '08:30 AM', checkOut: '-', shifts: 'Morning' },
    { id: 5, name: 'James Brown', role: 'Employee', status: 'late', checkIn: '09:45 AM', checkOut: '-', shifts: 'Morning' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: 'Employee', shifts: 'Morning' });

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = {
    total: employees.length,
    present: employees.filter(e => e.status === 'present').length,
    absent: employees.filter(e => e.status === 'absent').length,
    late: employees.filter(e => e.status === 'late').length,
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp.id === id) {
        const statuses = ['present', 'absent', 'late'];
        const currentIndex = statuses.indexOf(emp.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...emp, status: nextStatus };
      }
      return emp;
    }));
  };

  const addEmployee = () => {
    if (newEmployee.name.trim()) {
      setEmployees([...employees, {
        id: employees.length + 1,
        ...newEmployee,
        status: 'absent',
        checkIn: '-',
        checkOut: '-'
      }]);
      setNewEmployee({ name: '', role: 'Employee', shifts: 'Morning' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="attendance-wrapper">
      <div className="attendance-container">

        {/* Header */}
        <div className="header-section">
          <div className="header-left">
            <h1 className="header-title">Employee Attendance</h1>
            <p className="header-date">
              <Calendar className="icon-sm" />
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="header-time">
            <div className="time-display">
              <Clock className="icon-lg" />
              {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="time-label">Current Time</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-body">
              <div>
                <p className="stat-label">Total Employees</p>
                <p className="stat-value">{stats.total}</p>
              </div>
              <Users className="stat-icon" />
            </div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-body">
              <div>
                <p className="stat-label">Present</p>
                <p className="stat-value">{stats.present}</p>
              </div>
              <CheckCircle className="stat-icon" />
            </div>
          </div>

          <div className="stat-card stat-red">
            <div className="stat-body">
              <div>
                <p className="stat-label">Absent</p>
                <p className="stat-value">{stats.absent}</p>
              </div>
              <XCircle className="stat-icon" />
            </div>
          </div>

          <div className="stat-card stat-amber">
            <div className="stat-body">
              <div>
                <p className="stat-label">Late</p>
                <p className="stat-value">{stats.late}</p>
              </div>
              <Clock className="stat-icon" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-box">
          <div className="controls-inner">

            <div className="search-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                placeholder="Search employees by name or role..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="controls-actions">
              
              <div className="filter-wrapper">
                <Filter className="filter-icon" />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <button className="btn btn-blue" onClick={() => setShowAddModal(true)}>
                <UserPlus className="btn-icon" /> Add Employee
              </button>

              <button className="btn btn-green">
                <Download className="btn-icon" /> Export
              </button>

            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <div className="table-scroll">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Role</th>
                  <th>Shift</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={String(employee.id)} className={`table-row ${index % 2 === 0 ? 'row-alt' : ''}`}>
                    <td>{employee.name}</td>
                    <td>{employee.role}</td>
                    <td>{employee.shifts}</td>
                    <td>{employee.checkIn}</td>
                    <td>{employee.checkOut}</td>

                    <td>
                      <span className={`status-badge status-${employee.status}`}>
                        {employee.status === 'present' && <CheckCircle className="status-icon" />}
                        {employee.status === 'absent' && <XCircle className="status-icon" />}
                        {employee.status === 'late' && <Clock className="status-icon" />}
                        {employee.status}
                      </span>
                    </td>

                    <td>
                      <button onClick={() => toggleStatus(employee.id)} className="btn btn-blue small-btn">
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="empty-state">
              <Users className="empty-icon" />
              <p>No employees found</p>
            </div>
          )}

        </div>
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Add New Employee</h2>

            <div className="modal-input-group">
              <label>Employee Name</label>
              <input 
                type="text" 
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              />
            </div>

            <div className="modal-input-group">
              <label>Role</label>
              <select 
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div className="modal-input-group">
              <label>Shift</label>
              <select 
                value={newEmployee.shifts}
                onChange={(e) => setNewEmployee({...newEmployee, shifts: e.target.value})}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-blue" onClick={addEmployee}>Add Employee</button>
              <button className="btn btn-gray" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* End of modal */} 
    </div>
  );
};

export default EmployeeAttendance;