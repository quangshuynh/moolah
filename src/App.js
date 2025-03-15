import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [calcMode, setCalcMode] = useState("job");
  const [jobs, setJobs] = useState([
    { 
      hourlyWage: "", 
      hoursWorked: "", 
      daysWorked: "", 
      startDate: "", 
      endDate: "", 
      hoursPerDay: "8",
      showDateRange: false,
      excludedDays: [],
      showMoreStats: false
    }
  ]);
  const [annualSalary, setAnnualSalary] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

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

  const toggleMoreStats = (index) => {
    const newJobs = [...jobs];
    newJobs[index].showMoreStats = !newJobs[index].showMoreStats;
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
        excludedDays: [],
        showMoreStats: false
      }
    ]);
  };

  const removeJob = (index) => {
    const newJobs = [...jobs];
    newJobs.splice(index, 1);
    setJobs(newJobs);
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    let totalIncome = 0;
    jobs.forEach(job => {
      const wage = parseFloat(job.hourlyWage || 0);
      let income = 0;
      if (job.showDateRange && job.startDate && job.endDate) {
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
        if (job.daysWorked) {
          income += wage * parseFloat(job.daysWorked) * 8;
        } else if (job.hoursWorked) {
          income += wage * parseFloat(job.hoursWorked);
        }
      }
      totalIncome += income;
    });
    setResult(totalIncome);
  };

  const getYearlyBreakdown = (salary) => {
    const annual = parseFloat(salary) || 0;
    return {
      hourly: (annual / 2080).toFixed(2),
      daily: (annual / 260).toFixed(2),
      weekly: (annual / 52).toFixed(2),
      monthly: (annual / 12).toFixed(2),
      yearly: annual.toFixed(2)
    };
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <button className="mode-toggle" onClick={toggleDarkMode}>
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFC107" width="24" height="24" viewBox="0 0 24 24">
              <path d="M6.76 4.84l-1.8-1.79L3.55 4.46l1.79 1.8 1.42-1.42zm10.48 0l1.8-1.79-1.42-1.42-1.79 1.79 1.41 1.42zM12 4V0h-2v4h2zm0 20v-4h-2v4h2zm7-12h4v-2h-4v2zm-20 0h4v-2H-1v2zm16.24 7.16l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zm-10.48 0L4.55 17.5l1.41-1.41 1.79 1.79-1.42 1.42zM12 6a6 6 0 100 12 6 6 0 000-12z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="#484742" width="24" height="24" viewBox="0 0 24 24">
              <path d="M9.37 5.51A7.5 7.5 0 0116.49 12 7.5 7.5 0 019.37 18.49 7.5 7.5 0 019.37 5.51zm0-2.51c-1.02 0-2.01.16-2.93.47A9 9 0 1018.47 9.3c0-.07-.01-.13-.01-.2a7.5 7.5 0 00-7.5-7.5z"/>
            </svg>
          )}
        </button>
      </header>
      <h1>Income Calculator</h1>
      <div className="calc-mode-selector">
        <button 
          className={calcMode === "job" ? "active" : ""}
          onClick={() => setCalcMode("job")}
        >
          Job Income
        </button>
        <button 
          className={calcMode === "yearly" ? "active" : ""}
          onClick={() => setCalcMode("yearly")}
        >
          Yearly Salary
        </button>
      </div>
      {calcMode === "job" ? (
        <form onSubmit={handleJobSubmit} className="calc-form">
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
              {job.hourlyWage && parseFloat(job.hourlyWage) > 0 && (
                <>
                  <button 
                    type="button" 
                    className="toggle-stats-btn"
                    onClick={() => toggleMoreStats(index)}
                  >
                    {job.showMoreStats ? "Hide More Stats" : "Show More Stats"}
                  </button>
                  {job.showMoreStats && (
                    <div className="salary-breakdown-buttons">
                      <button type="button" className="breakdown-button">
                        Hourly: ${(parseFloat(job.hourlyWage)).toFixed(2)}
                      </button>
                      <button type="button" className="breakdown-button">
                        Daily: ${(parseFloat(job.hourlyWage) * 8).toFixed(2)}
                      </button>
                      <button type="button" className="breakdown-button">
                        Weekly: ${(parseFloat(job.hourlyWage) * 40).toFixed(2)}
                      </button>
                      <button type="button" className="breakdown-button">
                        Monthly: ${(parseFloat(job.hourlyWage) * 160).toFixed(2)}
                      </button>
                      <button type="button" className="breakdown-button">
                        Yearly: ${(parseFloat(job.hourlyWage) * 2080).toFixed(2)}
                      </button>
                    </div>
                  )}
                </>
              )}
              <div className="horizontal-group">
                <div className="input-group">
                  <label>Hours Worked:</label>
                  <input 
                    type="number"
                    placeholder="Hours worked"
                    value={job.hoursWorked}
                    disabled={job.showDateRange}
                    onChange={(e) => handleJobChange(index, 'hoursWorked', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Days Worked:</label>
                  <input 
                    type="number"
                    placeholder="Days worked"
                    value={job.daysWorked}
                    disabled={job.showDateRange}
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
          {result !== null && (
            <div className="result">
              <h2>Total Income: ${result.toFixed(2)}</h2>
            </div>
          )}
        </form>
      ) : (
        <div className="yearly-calculator">
          <div className="input-group">
            <label>Annual Salary ($):</label>
            <input
              type="number"
              placeholder="Enter your annual salary"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
            />
          </div>
          {annualSalary && (
            <div className="salary-breakdown">
              <p>Note: Stats assume an 8-hour day.</p>
              {(() => {
                const breakdown = getYearlyBreakdown(annualSalary);
                return (
                  <>
                    <p>Hourly: ${breakdown.hourly}</p>
                    <p>Daily: ${breakdown.daily}</p>
                    <p>Weekly: ${breakdown.weekly}</p>
                    <p>Monthly: ${breakdown.monthly}</p>
                    <p>Yearly: ${breakdown.yearly}</p>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
