import React from 'react';

const DashboardPage = () => {
  const powerBIReportURL = 'https://app.powerbi.com/view?r=eyJrIjoiYzIxNmRiODItNWZmZC00NTkwLWE3YTgtNzhmOGJmNWQzZTkwIiwidCI6IjhjNzhjMTIyLWY3ODEtNDUwMC05YzJhLWY2NDVhNzYyODFmNSJ9';

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="py-6 shadow-md text-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className=" mt-2">Interactive Dashboard for visualization of multiple diseases</p>
      </header>

      {/* Main Content Section */}
      <main className="p-6 flex flex-col items-center">
        <div className="w-full max-w-screen mx-10">
          {/* Power BI Embed */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={powerBIReportURL}
              frameBorder="0"
              className="w-full h-[85vh]" // Increased height
              allowFullScreen
              title="Power BI Dashboard"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
