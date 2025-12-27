import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { contactsAPI } from '../../services/api';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await contactsAPI.submit(data);
      if (response.data.success) {
        toast.success(response.data.message);
        reset();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit. Please try again.';
      const validationErrors = error.response?.data?.errors;

      if (validationErrors && validationErrors.length > 0) {
        validationErrors.forEach((err) => toast.error(err));
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-heading">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">
          Have a question or want to work with us? Fill out the form below and we'll get back to you soon.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Your full name"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobileNumber"
              className={`input-field ${errors.mobileNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Your Mobile Number"
              {...register('mobileNumber', {
                required: 'Mobile number is required',
                pattern: {
                  value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                  message: 'Please enter a valid mobile number',
                },
              })}
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email ID *
            </label>
            <input
              type="email"
              id="email"
              className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Comments / Feedback / Enquiry *
            </label>
            <textarea
              id="message"
              rows={5}
              className={`input-field resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Tell us about your project or inquiry..."
              {...register('message', {
                required: 'Message is required',
                minLength: { value: 10, message: 'Message must be at least 10 characters' },
                maxLength: { value: 2000, message: 'Message cannot exceed 2000 characters' },
              })}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-submit"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Submitting...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
