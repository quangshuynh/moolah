import React, { useState } from 'react';
import './App.css';

function App() {
  const [jobs, setJobs] = useState([
    { 
      hourlyWage: "", 
      hoursWorked: "", 
      daysWorked: "", 
      startDate: "", 
      endDate: "", 
      hoursPerDay: "8",
      showDateRange: false,
      excludedDays: [] // array of day names to exclude
    }
  ]);
  const [result, setResult] = useState(null);

  const handleJobChange = (index, field, value) => {
    const newJobs = [...jobs];
    newJobs[index][field] = value;
    setJobs(newJobs);
  };

  const handleExcludedDaysChange = (index, day, checked) => {
    const newJobs = [...jobs];
    let currentExcluded = newJobs[index].excludedDays || [];
    if (checked) {
      if (!currentExcluded.includes(day)) {
        currentExcluded.push(day);
      }
    } else {
      currentExcluded = currentExcluded.filter(d => d !== day);
    }
    newJobs[index].excludedDays = currentExcluded;
    setJobs(newJobs);
  };

  const toggleDateRange = (index) => {
    const newJobs = [...jobs];
    newJobs[index].showDateRange = !newJobs[index].showDateRange;
    setJobs(newJobs);
  };

  const addJob = () => {
    setJobs([
      ...jobs, 
      { 
        hourlyWage: "", 
        hoursWorked: "", 
        daysWorked: "", 
        startDate: "", 
        endDate: "", 
        hoursPerDay: "8",
        showDateRange: false,
        excludedDays: []
      }
    ]);
  };

  const removeJob = (index) => {
    const newJobs = [...jobs];
    newJobs.splice(index, 1);
    setJobs(newJobs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let totalIncome = 0;
    jobs.forEach(job => {
      const wage = parseFloat(job.hourlyWage || 0);
      let income = 0;
      
      if(job.showDateRange && job.startDate && job.endDate) {
        // calculate number of valid days in the date range (excluding specified days)
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let count = 0;
        let currentDate = new Date(job.startDate);
        const end = new Date(job.endDate);
        while (currentDate <= end) {
          const dayName = dayNames[currentDate.getDay()];
          if (!job.excludedDays || !job.excludedDays.includes(dayName)) {
            count++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        income += wage * count * parseFloat(job.hoursPerDay || 8);
      } else {
        // if date range is not active, use days or hours
        if(job.daysWorked) {
          income += wage * parseFloat(job.daysWorked) * 8;
        } else if(job.hoursWorked) {
          income += wage * parseFloat(job.hoursWorked);
        }
      }
      
      totalIncome += income;
    });
    setResult(totalIncome);
  };

  return (
    <div className="app">
      <h1>Job Income Calculator</h1>
      <form onSubmit={handleSubmit} className="calc-form">
        {jobs.map((job, index) => (
          <div key={index} className="job-card">
            <h2>Job {index + 1}</h2>
            <div className="input-group">
              <label>Hourly Wage ($):</label>
              <input 
                type="number"
                placeholder="Enter hourly wage"
                value={job.hourlyWage}
                onChange={(e) => handleJobChange(index, 'hourlyWage', e.target.value)}
              />
            </div>
            <div className="horizontal-group">
              <div className="input-group">
                <label>Hours Worked:</label>
                <input 
                  type="number"
                  placeholder="Hours worked"
                  value={job.hoursWorked}
                  disabled={job.showDateRange} // disabled when date range is active
                  onChange={(e) => handleJobChange(index, 'hoursWorked', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Days Worked:</label>
                <input 
                  type="number"
                  placeholder="Days worked"
                  value={job.daysWorked}
                  disabled={job.showDateRange} // disabled when date range is active
                  onChange={(e) => handleJobChange(index, 'daysWorked', e.target.value)}
                />
              </div>
            </div>
            <button 
              type="button" 
              className="toggle-btn"
              onClick={() => toggleDateRange(index)}
            >
              {job.showDateRange ? 'Hide Date Range' : 'Show Date Range'}
            </button>
            {job.showDateRange && (
              <div className="date-range">
                <div className="input-group">
                  <label>Start Date:</label>
                  <input 
                    type="date"
                    value={job.startDate}
                    onChange={(e) => handleJobChange(index, 'startDate', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>End Date:</label>
                  <input 
                    type="date"
                    value={job.endDate}
                    onChange={(e) => handleJobChange(index, 'endDate', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Hours Per Day:</label>
                  <input 
                    type="number"
                    placeholder="Hours per day"
                    value={job.hoursPerDay}
                    onChange={(e) => handleJobChange(index, 'hoursPerDay', e.target.value)}
                  />
                </div>
                <div className="exclude-days">
                  <label>Exclude Days:</label>
                  <div className="checkbox-group">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => (
                      <label key={day}>
                        <input 
                          type="checkbox"
                          value={day}
                          checked={job.excludedDays.includes(day)}
                          onChange={(e) => handleExcludedDaysChange(index, day, e.target.checked)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {jobs.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeJob(index)}
              >
                Remove Job
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addJob}>
          Add Job
        </button>
        <button type="submit" className="calc-btn">
          Calculate Total Income
        </button>
      </form>
      {result !== null && (
        <div className="result">
          <h2>Total Income: ${result.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
