import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type JobStatus =
  | "Saved"
  | "Applied"
  | "Interview"
  | "Rejected"
  | "Offer";

type Job = {
  id: string;
  company: string;
  role: string;
  url: string;
  status: JobStatus;
  applicationDate: string;
  notes: string;
};

const statuses: JobStatus[] = [
  "Saved",
  "Applied",
  "Interview",
  "Rejected",
  "Offer",
];

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("Saved");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    JobStatus | "All"
  >("All");
const [applicationDate, setApplicationDate] = useState("");
const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(
    null
  );
  const exportJobs = () => {
  if (jobs.length === 0) {
    alert("No applications to export.");
    return;
  }

  const headers = [
    "Company",
    "Role",
    "URL",
    "Status",
    "Application Date",
    "Notes",
  ];

  const rows = jobs.map((job) => [
    job.company,
    job.role,
    job.url,
    job.status,
    job.applicationDate || "",
    job.notes || "",
  ]);

  const csvContent = [
    headers,
    ...rows,
  ]
    .map((row) =>
      row
        .map((value) =>
          `"${String(value).replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "jobtrack-applications.csv";
  link.click();

  URL.revokeObjectURL(url);
};

  useEffect(() => {
    const loadJobs = async () => {
      const result = await chrome.storage.local.get("jobs");

      const savedJobs = Array.isArray(result.jobs)
        ? (result.jobs as Job[])
        : [];

      setJobs(savedJobs);
    };

    loadJobs();
  }, []);

  const saveJobs = async (updatedJobs: Job[]) => {
    setJobs(updatedJobs);

    await chrome.storage.local.set({
      jobs: updatedJobs,
    });
  };

  const captureCurrentPage = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.url || !tab.url.startsWith("http")) {
        alert("Unable to capture this page.");
        return;
      }

      setUrl(tab.url);

      if (!role.trim() && tab.title) {
        setRole(tab.title);
      }

      alert("Current page captured!");
    } catch (error) {
      console.error("Error capturing page:", error);
      alert("Could not capture the current page.");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!company.trim() || !role.trim() || !url.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingId) {
      const updatedJobs = jobs.map((job) =>
        job.id === editingId
          ? {
              ...job,
              company: company.trim(),
              role: role.trim(),
              url: url.trim(),
              status,
            }
          : job
      );
       saveJobs(updatedJobs);
  alert("Job updated successfully!");

      saveJobs(updatedJobs);
      alert("Job updated successfully!");
    } else {
      const newJob: Job = {
  id: crypto.randomUUID(),
  company: company.trim(),
  role: role.trim(),
  url: url.trim(),
  status,
  applicationDate,
  notes: notes.trim(),
};

      saveJobs([newJob, ...jobs]);
      alert("Job saved successfully!");
    }

    resetForm();
  };

 const resetForm = () => {
  setCompany("");
  setRole("");
  setUrl("");
  setStatus("Saved");
  setApplicationDate("");
  setNotes("");
  setEditingId(null);
};

  const editJob = (job: Job) => {
  setEditingId(job.id);
  setCompany(job.company);
  setRole(job.role);
  setUrl(job.url);
  setStatus(job.status);
  setApplicationDate(job.applicationDate || "");
  setNotes(job.notes || "");
};

  const deleteJob = (id: string) => {
    const updatedJobs = jobs.filter((job) => job.id !== id);

    saveJobs(updatedJobs);

    if (editingId === id) {
      resetForm();
    }
  };

  const updateStatus = (
    id: string,
    newStatus: JobStatus
  ) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id
        ? { ...job, status: newStatus }
        : job
    );

    saveJobs(updatedJobs);
  };

  const filteredJobs = jobs.filter((job) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      job.company.toLowerCase().includes(searchValue) ||
      job.role.toLowerCase().includes(searchValue);

    const matchesStatus =
      filterStatus === "All" || job.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const appliedCount = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewCount = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offerCount = jobs.filter(
    (job) => job.status === "Offer"
  ).length;
  const getStatusClass = (status: JobStatus) => {
  return `status-badge status-${status.toLowerCase()}`;
};
const progressPercentage =
  jobs.length > 0
    ? Math.round((interviewCount / jobs.length) * 100)
    : 0;

  return (
    <main className="app">
      <header>
        <h1>JobTrack</h1>
        <p>Manage your job applications</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="job-form"
      >
        <input
          type="text"
          placeholder="Company name"
          value={company}
          onChange={(event) =>
            setCompany(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Job role"
          value={role}
          onChange={(event) =>
            setRole(event.target.value)
          }
        />

        <button
          type="button"
          className="secondary-btn"
          onClick={captureCurrentPage}
        >
          Use Current Page
        </button>

        <input
          type="url"
          placeholder="Job URL"
          value={url}
          onChange={(event) =>
            setUrl(event.target.value)
          }
        />

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as JobStatus)
          }
        >
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingId ? "Update Job" : "Save Job"}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={resetForm}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <section className="jobs-section">
        <div className="section-header">
  <h2>
    My Applications ({jobs.length})
  </h2>

  <button
    type="button"
    className="export-btn"
    onClick={exportJobs}
  >
    Export CSV
  </button>
</div>

        <div className="stats">
          <p>Total: {jobs.length}</p>
          <p>Applied: {appliedCount}</p>
          <p>Interviews: {interviewCount}</p>
          <p>Offers: {offerCount}</p>
        </div>
        <div className="progress-section">
  <div className="progress-header">
    <span>Interview Progress</span>
    <strong>{progressPercentage}%</strong>
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${progressPercentage}%` }}
    ></div>
  </div>
</div>

        <input
          type="search"
          placeholder="Search company or role..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={filterStatus}
          onChange={(event) =>
            setFilterStatus(
              event.target.value as JobStatus | "All"
            )
          }
        >
          <option value="All">All Statuses</option>

          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {filteredJobs.length === 0 ? (
          <p className="empty">
            No matching applications found.
          </p>
        ) : (
          filteredJobs.map((job) => (
            <article
              className="job-card"
              key={job.id}
            >
              <h3>{job.role}</h3>

<p>{job.company}</p>

<span className={getStatusClass(job.status)}>
  {job.status}
</span>

{job.applicationDate && (
  <p>
    <strong>Applied on:</strong>{" "}
    {job.applicationDate}
  </p>
)}

{job.notes && (
  <p>
    <strong>Notes:</strong> {job.notes}
  </p>
)}

              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
              >
                View Job
              </a>

              <select
                value={job.status}
                onChange={(event) =>
                  updateStatus(
                    job.id,
                    event.target.value as JobStatus
                  )
                }
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="edit-btn"
                onClick={() => editJob(job)}
              >
                Edit
              </button>
              

<textarea
  placeholder="Notes (optional)"
  value={notes}
  onChange={(event) =>
    setNotes(event.target.value)
  }
  rows={3}
/>

              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;