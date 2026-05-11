"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Star, Send, Loader2, ShieldCheck } from "lucide-react";
import styles from "./ProductPage.module.css";
import commentStyles from "./CommentsSection.module.css";

type Comment = {
  id: string;
  rating: number;
  body: string;
  created_at: string;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
};

interface Props {
  productId: string;
  initialComments: Comment[];
  currentUserId: string | null;
  allowComments: boolean;
}

export default function CommentsSection({ productId, initialComments, currentUserId, allowComments }: Props) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const avgRating = comments.length
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : "0.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError("");

    const { data, error: insertError } = await supabase
      .from("comments")
      .insert({ product_id: productId, user_id: currentUserId, rating, body: body.trim() })
      .select("id, rating, body, created_at, profiles(full_name)")
      .single();

    if (insertError) {
      setError("Failed to post comment. Please try again.");
    } else if (data) {
      setComments([data as Comment, ...comments]);
      setBody("");
      setRating(5);
    }
    setLoading(false);
  };

  const getProfile = (profiles: Comment['profiles']) => {
    if (!profiles) return null;
    return Array.isArray(profiles) ? profiles[0] : profiles;
  };

  const displayName = (profiles: Comment['profiles']) => {
    const name = getProfile(profiles)?.full_name;
    if (!name) return "Anonymous";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return name;
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  };

  const avatarLetter = (profiles: Comment['profiles']) =>
    getProfile(profiles)?.full_name?.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className={styles.reviewsSection}>
      {/* Header */}
      <div className={styles.reviewsHeader}>
        <div className={styles.reviewsStats}>
          <span className={styles.totalReviews}>{comments.length} reviews</span>
          <span className={styles.dividerLarge}>|</span>
          <span className={styles.ratingNumber}>{avgRating}</span>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={16}
                fill={i <= Math.round(Number(avgRating)) ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
        <div className={styles.verifiedBadge}>
          <ShieldCheck size={16} color="white" fill="#00a650" />
          <span>All reviews are from verified purchases</span>
        </div>
      </div>

      {/* Add comment form */}
      {allowComments && currentUserId && (
        <form className={commentStyles.form} onSubmit={handleSubmit}>
          <div className={commentStyles.starPicker}>
            <span className={commentStyles.label}>Your rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className={commentStyles.starBtn}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                aria-label={`Rate ${s} stars`}
              >
                <Star
                  size={22}
                  fill={(hoverRating || rating) >= s ? "#111" : "none"}
                  color="#111"
                />
              </button>
            ))}
          </div>
          <div className={commentStyles.inputRow}>
            <textarea
              className={commentStyles.textarea}
              placeholder="Share your experience with this product..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              required
            />
            <button
              type="submit"
              disabled={loading || !body.trim()}
              className={commentStyles.submitBtn}
              aria-label="Post comment"
            >
              {loading ? <Loader2 size={18} className={commentStyles.spin} /> : <Send size={18} />}
            </button>
          </div>
          {error && <p className={commentStyles.error}>{error}</p>}
        </form>
      )}

      {allowComments && !currentUserId && (
        <p className={commentStyles.loginPrompt}>
          <a href="/auth">Sign in</a> to leave a review.
        </p>
      )}

      {/* Comments list */}
      <div className={styles.commentsList}>
        {comments.length === 0 && (
          <p className={commentStyles.empty}>No reviews yet. Be the first!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <div className={styles.commentAvatar}>
                {avatarLetter(c.profiles)}
              </div>
              <div className={styles.commentAuthorInfo}>
                <span className={styles.commentAuthor}>
                  {displayName(c.profiles)}
                </span>
                {" on "}
                {new Date(c.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className={styles.commentStars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill={i <= c.rating ? "currentColor" : "none"} />
              ))}
            </div>
            <div className={styles.commentText}>{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
