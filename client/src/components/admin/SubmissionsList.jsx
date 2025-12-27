const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function SubmissionsList({
  submissions,
  isLoading,
  pagination,
  onPageChange,
  onView,
  onUpdateStatus,
  onDelete,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">No submissions found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{submission.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{submission.mobileNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[submission.status]}`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(submission.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onView(submission)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onDelete(submission._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {submissions.map((submission) => (
          <div key={submission._id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">{submission.name}</p>
                <p className="text-sm text-gray-500">{submission.email}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[submission.status]}`}>
                {submission.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{submission.mobileNumber}</p>
            <p className="text-xs text-gray-400 mb-3">{formatDate(submission.createdAt)}</p>
            <div className="flex gap-3">
              <button
                onClick={() => onView(submission)}
                className="text-sm text-primary-600 hover:text-primary-900"
              >
                View Details
              </button>
              <button
                onClick={() => onDelete(submission._id)}
                className="text-sm text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
