"use client";

import {
  useEffect,
  useState
} from "react";

import { useRouter } from "next/navigation";

import {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
  importApplications
} from "@/lib/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function DashboardPage() {

  const router = useRouter();

  const [applications, setApplications] =
    useState<any[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingApp, setEditingApp] =
    useState<any | null>(null);

  const [company, setCompany] =
    useState("");

  const [position, setPosition] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [status, setStatus] =
    useState("Submitted");

  const [notes, setNotes] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [csvFile, setCsvFile] =
    useState<File | null>(null);

  useEffect(() => {

    async function loadApplications() {

      const token =
        localStorage.getItem("token");

      if (!token) {

        router.push("/login");
        return;
      }

      try {

        const data =
          await getApplications(token);

        setApplications(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    loadApplications();

  }, [router]);

  function handleLogout() {

    localStorage.removeItem("token");

    router.push("/login");
  }

  async function handleCreateApplication() {

    const token =
      localStorage.getItem("token");

    if (!token) return;

    const newApp = {
      company,
      position,
      location,
      status,
      notes,
      applied_date:
        new Date().toISOString().split("T")[0],
    };

    try {

      const created =
        await createApplication(
          token,
          newApp
        );

      setApplications([
        created,
        ...applications
      ]);

      resetForm();

    } catch (err) {

      console.error(err);
    }
  }

  async function handleUpdateApplication() {

    const token =
      localStorage.getItem("token");

    if (!token || !editingApp) return;

    const updatedApp = {
      company,
      position,
      location,
      status,
      notes,
      applied_date:
        editingApp.applied_date,
    };

    try {

      const updated =
        await updateApplication(
          token,
          editingApp.id,
          updatedApp
        );

      setApplications(
        applications.map((app) =>
          app.id === updated.id
            ? updated
            : app
        )
      );

      resetForm();

    } catch (err) {

      console.error(err);
    }
  }

  async function handleDelete(
    id: number
  ) {

    const token =
      localStorage.getItem("token");

    if (!token) return;

    try {

      await deleteApplication(
        token,
        id
      );

      setApplications(
        applications.filter(
          (app) =>
            app.id !== id
        )
      );

    } catch (err) {

      console.error(err);
    }
  }

  async function handleImportCSV() {

    const token =
      localStorage.getItem("token");

    if (!token || !csvFile) return;

    try {

      await importApplications(
        token,
        csvFile
      );

      const updated =
        await getApplications(token);

      setApplications(updated);

      setCsvFile(null);

      alert(
        "Applications imported!"
      );

    } catch (err) {

      console.error(err);
    }
  }

  function openEditModal(app: any) {

    setEditingApp(app);

    setCompany(app.company);
    setPosition(app.position);
    setLocation(app.location);
    setStatus(app.status);
    setNotes(app.notes || "");

    setShowForm(true);
  }

  function resetForm() {

    setShowForm(false);

    setEditingApp(null);

    setCompany("");
    setPosition("");
    setLocation("");
    setStatus("Submitted");
    setNotes("");
  }

  const submittedCount =
    applications.filter(
      (app) =>
        app.status === "Submitted"
    ).length;

  const rejectedCount =
    applications.filter(
      (app) =>
        app.status === "Rejected"
    ).length;

  const interviewCount =
    applications.filter(
      (app) =>
        app.status === "Interview"
    ).length;

  const offerCount =
    applications.filter(
      (app) =>
        app.status === "Offer"
    ).length;

  const chartData = [
    {
      name: "Submitted",
      value: submittedCount
    },
    {
      name: "Interview",
      value: interviewCount
    },
    {
      name: "Rejected",
      value: rejectedCount
    },
    {
      name: "Offer",
      value: offerCount
    }
  ];

  const applicationTimeline =
    applications.map(
      (app, index) => ({
        name: `App ${index + 1}`,
        total: index + 1
      })
    );

  return (
    <main className="min-h-screen bg-linear-to-b from-black via-gray-950 to-gray-900 text-white">

      <nav className="border-b border-gray-800 px-8 py-5 flex items-center justify-between flex-wrap gap-4">

        <div>

          <h1 className="text-2xl font-bold">
            Job Tracker
          </h1>

          <p className="text-gray-400 text-sm">
            Manage your applications and interviews
          </p>

        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <input
            type="file"
            accept=".csv"
            onChange={(e) => {

              if (e.target.files?.[0]) {

                setCsvFile(
                  e.target.files[0]
                );
              }
            }}
            className="
              text-sm
              text-gray-400
              file:bg-gray-800
              file:border-0
              file:text-white
              file:px-3
              file:py-2
              file:rounded-lg
            "
          />

          <button
            onClick={handleImportCSV}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition"
          >
            Import CSV
          </button>

          <button
            onClick={() =>
              setShowForm(true)
            }
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition"
          >
            + Add Application
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto p-8">

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

            <p className="text-gray-400 text-sm">
              Total Applications
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {applications.length}
            </h2>

          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

            <p className="text-gray-400 text-sm">
              Interviews
            </p>

            <h2 className="text-4xl font-bold mt-2 text-blue-400">
              {interviewCount}
            </h2>

          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

            <p className="text-gray-400 text-sm">
              Offers
            </p>

            <h2 className="text-4xl font-bold mt-2 text-green-400">
              {offerCount}
            </h2>

          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">

            <p className="text-gray-400 text-sm">
              Rejections
            </p>

            <h2 className="text-4xl font-bold mt-2 text-red-400">
              {rejectedCount}
            </h2>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-10">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Application Status Breakdown
            </h2>

            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >

                    <Cell fill="#3B82F6" />
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#10B981" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Application Growth
            </h2>

            <div className="h-80">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={applicationTimeline}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    fill="#3B82F6"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {showForm && (

          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6">

            <div className="bg-gray-900 border border-gray-800 w-full max-w-2xl rounded-2xl p-8 space-y-5">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-semibold">

                  {editingApp
                    ? "Edit Application"
                    : "Add Application"}

                </h2>

                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>

              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <input
                  placeholder="Company"
                  value={company}
                  onChange={(e) =>
                    setCompany(e.target.value)
                  }
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700"
                />

                <input
                  placeholder="Position"
                  value={position}
                  onChange={(e) =>
                    setPosition(e.target.value)
                  }
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700"
                />

                <input
                  placeholder="Location"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700"
                />

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700"
                >

                  <option>
                    Submitted
                  </option>

                  <option>
                    Interview
                  </option>

                  <option>
                    Rejected
                  </option>

                  <option>
                    Offer
                  </option>

                </select>

              </div>

              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700"
              />

              <div className="flex gap-3">

                <button
                  onClick={
                    editingApp
                      ? handleUpdateApplication
                      : handleCreateApplication
                  }
                  className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg transition"
                >

                  {editingApp
                    ? "Update Application"
                    : "Create Application"}

                </button>

                <button
                  onClick={resetForm}
                  className="bg-gray-800 hover:bg-gray-700 px-5 py-3 rounded-lg transition"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

        <div>

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-semibold">
              Applications
            </h2>

            <p className="text-gray-400 text-sm">
              {submittedCount} currently submitted
            </p>

          </div>

          {loading ? (

            <div className="text-gray-400">
              Loading applications...
            </div>

          ) : applications.length === 0 ? (

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">

              <h3 className="text-2xl font-semibold mb-3">
                No Applications Yet
              </h3>

              <p className="text-gray-400 mb-6">
                Import your spreadsheet or create applications manually.
              </p>

              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-lg transition"
              >
                Add First Application
              </button>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {applications.map((app: any) => (

                <div
                  key={app.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500 transition"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <h3 className="text-xl font-semibold">
                        {app.company}
                      </h3>

                      <p className="text-gray-400 mt-1">
                        {app.position}
                      </p>

                    </div>

                    <span
                      className={`
                        text-xs px-3 py-1 rounded-full
                        ${
                          app.status === "Rejected"
                            ? "bg-red-500/20 text-red-400"
                            : app.status === "Interview"
                            ? "bg-blue-500/20 text-blue-400"
                            : app.status === "Offer"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-700 text-gray-300"
                        }
                      `}
                    >
                      {app.status}
                    </span>

                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-400">

                    <p>
                      📍 {app.location}
                    </p>

                    <p>
                      📅 {app.applied_date}
                    </p>

                  </div>

                  {app.notes && (

                    <div className="mt-4 p-3 bg-gray-800 rounded-lg text-sm text-gray-300">
                      {app.notes}
                    </div>

                  )}

                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() =>
                        openEditModal(app)
                      }
                      className="flex-1 bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(app.id)
                      }
                      className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}