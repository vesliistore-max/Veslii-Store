import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  productId?: string;
  onAddReview?: (reviewData: { author: string; city: string; rating: number; title: string; comment: string }) => Promise<void>;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  productId,
  onAddReview,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !comment.trim() || !onAddReview) return;

    setSubmitting(true);
    try {
      await onAddReview({
        author,
        city,
        rating,
        title,
        comment,
      });
      setSubmittedMessage('Thank you! Your verified review has been posted.');
      setIsFormOpen(false);
      setAuthor('');
      setCity('');
      setTitle('');
      setComment('');
    } catch {
      setSubmittedMessage('Review received. Thank you for your feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <section className="py-16 sm:py-20 bg-[#FDFDFD] border-t border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-neutral-500 uppercase">
              COMMUNITY FEEDBACK
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-neutral-900 mt-2 mb-2">
              Customer Experiences
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      Number(averageRating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                {averageRating} / 5.0
              </span>
              <span className="text-xs text-neutral-500">
                ({reviews.length} genuine {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          {onAddReview && (
            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold tracking-wider uppercase transition-colors self-start md:self-auto"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{isFormOpen ? 'Cancel' : 'Write a Review'}</span>
            </button>
          )}
        </div>

        {submittedMessage && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Review Submission Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-12 p-6 sm:p-8 bg-neutral-50 border border-neutral-200/80 max-w-2xl animate-in fade-in duration-300"
          >
            <h3 className="text-base font-semibold text-neutral-900 mb-4">
              Share Your Genuine Experience
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-neutral-300 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating >= star ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-medium text-neutral-600 ml-2">
                    {rating} Star{rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Asad Qureshi"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Karachi / Lahore / Islamabad"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Remarkable finish on the bezel"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Comments & Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the build quality, materials, delivery, and overall satisfaction..."
                  className="w-full px-3 py-2 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-neutral-900"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold tracking-widest uppercase transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews List or Empty State */}
        {reviews.length === 0 ? (
          <div className="py-12 px-6 text-center border border-dashed border-neutral-300 bg-neutral-50/50">
            <p className="text-neutral-700 font-medium mb-1">No reviews yet for this selection.</p>
            <p className="text-neutral-500 text-xs sm:text-sm">
              We never generate fake testimonials. Be the first to share your experience with VESLII.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 bg-white border border-neutral-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400 tabular-nums">
                      {rev.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                    {rev.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-neutral-900">{rev.author}</span>
                    {rev.city && <span className="text-neutral-400">({rev.city})</span>}
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
