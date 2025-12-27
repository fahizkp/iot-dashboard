const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  read: 'bg-yellow-100 text-yellow-800',
  replied: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

export default function SubmissionDetail({ submission, onClose, onUpdateStatus, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = (e) => {
    onUpdateStatus(submission._id, e.target.value);
  };

  const handleDelete = () => {
    onDelete(submission._id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Submission Details</h2>
              <p className="text-sm text-gray-500 mt-1">{formatDate(submission.createdAt)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[submission.status]}`}>
                {submission.status}
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor="status" className="text-sm text-gray-600">Change status:</label>
                <select
                  id="status"
                  value={submission.status}
                  onChange={handleStatusChange}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="mt-1 text-gray-900">{submission.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-gray-900">
                  <a href={`mailto:${submission.email}`} className="text-primary-600 hover:underline">
                    {submission.email}
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                <p className="mt-1 text-gray-900">
                  <a href={`tel:${submission.mobileNumber}`} className="text-primary-600 hover:underline">
                    {submission.mobileNumber}
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Submitted</label>
                <p className="mt-1 text-gray-900">{formatDate(submission.createdAt)}</p>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Message</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap">{submission.message}</p>
              </div>
            </div>

            {/* Metadata */}
            {(submission.ipAddress || submission.userAgent) && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400 mb-2">Metadata</p>
                {submission.ipAddress && (
                  <p className="text-xs text-gray-500">IP: {submission.ipAddress}</p>
                )}
                {submission.userAgent && (
                  <p className="text-xs text-gray-500 truncate">UA: {submission.userAgent}</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Delete Submission
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
