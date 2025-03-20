import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [calcMode, setCalcMode] = useState("job");
  const [jobCount, setJobCount] = useState(1);
  const [jobs, setJobs] = useState([
    { 
      jobName: "Job 1",
      hourlyWage: "", 
      hoursWorked: "", 
      daysWorked: "", 
      startDate: "", 
      endDate: "", 
      hoursPerDay: "8",
      showDateRange: false,
      excludedDays: [],
      showMoreStats: false,
      isEditingName: false
    }
  ]);
  const [annualSalary, setAnnualSalary] = useState("");
  const [result, setResult] = useState(null);
  const [customTimeValue, setCustomTimeValue] = useState("");
  const [customTimeUnit, setCustomTimeUnit] = useState("seconds");

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
    const newJobCount = jobCount + 1;
    setJobCount(newJobCount);
    setJobs([
      ...jobs, 
      { 
        jobName: `Job ${newJobCount}`,
        hourlyWage: "", 
        hoursWorked: "", 
        daysWorked: "", 
        startDate: "", 
        endDate: "", 
        hoursPerDay: "8",
        showDateRange: false,
        excludedDays: [],
        showMoreStats: false,
        isEditingName: false
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
    const jobIncomes = jobs.map(job => {
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
        income = wage * count * parseFloat(job.hoursWorked || 0);
      } else {
        if (job.daysWorked) {
          income = wage * parseFloat(job.daysWorked) * parseFloat(job.hoursWorked || 0);
        } else if (job.hoursWorked) {
          income = wage * parseFloat(job.hoursWorked);
        }
      }
      totalIncome += income;
      return { jobName: job.jobName, income };
    });
    setResult({ totalIncome, jobIncomes });
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

  const getCustomSalary = (annual, timeValue, unit) => {
    const parsedAnnual = parseFloat(annual) || 0;
    const parsedTime = parseFloat(timeValue) || 0;
    const multipliers = {
      seconds: 1 / (2080 * 3600),
      minutes: 1 / (2080 * 60),
      hours: 1 / 2080,
      days: 1 / 260,
      weeks: 1 / 52,
      months: 1 / 12,
      years: 1,
    };
    return parsedAnnual * (multipliers[unit] * parsedTime);
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
      <div className="title-container">
        <h1 className="app-title">
          <span className="money-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
          </svg>
          </span>
          Moolah
        </h1>
      </div>
      <div className="calc-mode-selector">
        <button 
          className={calcMode === "job" ? "active" : ""}
          onClick={() => setCalcMode("job")}
        >
          Hourly Wage
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
              {jobs.length > 1 && (
                <button 
                  type="button" 
                  className="remove-icon-btn"
                  onClick={() => removeJob(index)}
                >
                  &times;
                </button>
              )}
              <div className="job-name-container">
                {job.isEditingName ? (
                  <div className="edit-name-group">
                    <input 
                      type="text"
                      value={job.jobName}
                      onChange={(e) => handleJobChange(index, 'jobName', e.target.value)}
                      className="job-name-input"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleJobChange(index, 'isEditingName', false)} 
                      className="done-btn"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="display-name-group">
                    <h2>{job.jobName}</h2>
                    <button 
                      type="button" 
                      onClick={() => handleJobChange(index, 'isEditingName', true)} 
                      className="edit-icon-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-9.5 9.5a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9.5-9.5zM11.207 2.5 13.5 4.793 12.207 6.086 9.914 3.793 11.207 2.5zM10.5 3.207 3 10.707V13h2.293l7.5-7.5L10.5 3.207z"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="input-group">
                <label>Hourly Wage ($):</label>
                <input 
                  type="number"
                  placeholder="Enter hourly wage"
                  min="0"
                  step="0.01"
                  value={job.hourlyWage}
                  onChange={(e) => handleJobChange(index, 'hourlyWage', e.target.value)}
                />
              </div>
            {/* {!job.showDateRange && (
                <div className="input-group">
                  <label>Hours Per Day:</label>
                  <input 
                    type="number"
                    placeholder="Enter hours per day"
                    value={job.hoursPerDay}
                    onChange={(e) => handleJobChange(index, 'hoursPerDay', e.target.value)}
                  />
                </div>
              )} */}
              {job.hourlyWage && parseFloat(job.hourlyWage) > 0 && (
                <>
                  <button 
                    type="button" 
                    className="toggle-stats-btn"
                    onClick={() => toggleMoreStats(index)}
                  >
                    {job.showMoreStats ? "Hide  Stats" : "Show 8 Hours Stats"}
                  </button>
                  {job.showMoreStats && (
                    <div className="salary-breakdown-buttons">
                      <button type="button" className="breakdown-button">
                        Hourly: ${(parseFloat(job.hourlyWage)).toFixed(2)}
                      </button>
                      <button type="button" className="breakdown-button">
                        Daily: ${(parseFloat(job.hourlyWage) * parseFloat(job.hoursPerDay || 8)).toFixed(2)}
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
                    placeholder="Enter hours per day"
                    value={job.hoursWorked}
                    min="0"
                    max="24"
                    disabled={job.showDateRange}
                    onChange={(e) => handleJobChange(index, 'hoursWorked', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Days Worked:</label>
                  <input 
                    type="number"
                    placeholder="Enter days per week"
                    value={job.daysWorked}
                    min="0"
                    max="7"
                    disabled={job.showDateRange}
                    onChange={(e) => handleJobChange(index, 'daysWorked', e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="button" 
                className="show-date-range-btn"
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
                    <div className="exclude-days-checkbox-group">
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
              {jobs.length > 1 ? (
                <div className="income-breakdown">
                  {result.jobIncomes.map((job, index) => (
                    <p key={index}>{job.jobName} Income: ${job.income.toFixed(2)}</p>
                  ))}
                  <hr />
                  <h2>Total Weekly Income: ${result.totalIncome.toFixed(2)}</h2>
                </div>
              ) : (
                <h2>Total Weekly Income: ${result.totalIncome.toFixed(2)}</h2>
              )}
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
              min="0"
              onChange={(e) => setAnnualSalary(e.target.value)}
            />
          </div>
          <div className="eight-hours-note">
            These stats assume an 8-hour day
          </div>
          {annualSalary && (
            <div className="salary-breakdown">
              {(() => {
                const breakdown = getYearlyBreakdown(annualSalary);
                return (
                  <>
                    <p>Hourly: ${breakdown.hourly}</p>
                    <p>Daily: ${breakdown.daily}</p>
                    <p>Weekly: ${breakdown.weekly}</p>
                    <p>Monthly: ${breakdown.monthly}</p>
                    <p>Yearly: ${breakdown.yearly}</p>
                    <div className="custom-breakdown" style={{ marginTop: '10px' }}>
                      <p>
                        Custom Time: 
                        <input 
                          type="number" 
                          value={customTimeValue}
                          onChange={(e) => setCustomTimeValue(e.target.value)}
                          placeholder="0"
                          style={{ marginLeft: '10px', marginRight: '8px', width: '70px' }}
                        />
                        <select 
                          value={customTimeUnit} 
                          onChange={(e) => setCustomTimeUnit(e.target.value)}
                          style={{ marginRight: '8px' }}
                        >
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                        = ${getCustomSalary(annualSalary, customTimeValue, customTimeUnit).toFixed(2)}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
      <footer className="footer">
        © {new Date().getFullYear()} Quang
      </footer>
    </div>
  );
}

export default App;