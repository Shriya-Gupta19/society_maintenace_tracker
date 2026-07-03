import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";

function ComplaintDetails() {
  return (
    <MainLayout>
      <PageHeader
        title="Complaint Details"
        subtitle="View complete complaint information."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold mb-4">
          Complaint Details
        </h2>

        <p className="text-gray-500">
          This page will display the complaint information here.
        </p>
      </div>
    </MainLayout>
  );
}

export default ComplaintDetails;