"use client";

import React, { useState, useEffect } from "react";

interface NetworkingSuggestion {
    id: string;
    name: string;
    role: string;
    company: string;
    matchScore: number;
    matchReasons: string[];
    sharedInterests: string[];
    suggestedIcebreaker: string;
    linkedInUrl?: string;
}

interface NetworkingResponse {
    success: boolean;
    suggestions: NetworkingSuggestion[];
    error?: string;
}

interface SuggestionListProps {
    interests?: string[];
    role?: string;
    goals?: string[];
    track?: string;
}

export function SuggestionList({
    interests = ["technology", "software"],
    role = "Software Engineer",
    goals = ["networking"],
    track = "General",
}: SuggestionListProps) {
    const [suggestions, setSuggestions] = useState<NetworkingSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSuggestions() {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    interests: interests.join(","),
                    role,
                    goals: goals.join(","),
                    track,
                });

                const response = await fetch(`/api/ai/suggest-networking?${params.toString()}`);
                const data: NetworkingResponse = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch suggestions");
                }

                setSuggestions(data.suggestions);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchSuggestions();
    }, [interests, role, goals, track]);

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    if (loading) {
        return (
            <div className="suggestions-loading">
                <div className="header-skeleton" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="person-skeleton" />
                ))}
                <style jsx>{`
          .suggestions-loading {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .header-skeleton {
            height: 28px;
            width: 160px;
            background: var(--bg-secondary);
            border-radius: 8px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .person-skeleton {
            height: 100px;
            background: var(--bg-secondary);
            border-radius: 16px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="suggestions-error">
                <div className="error-icon">⚠️</div>
                <h3>Unable to Load Suggestions</h3>
                <p>{error}</p>
                <style jsx>{`
          .suggestions-error {
            text-align: center;
            padding: 40px 20px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
          }
          .error-icon { font-size: 2rem; margin-bottom: 12px; }
          h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 8px; }
          p { font-size: 0.875rem; color: var(--text-secondary); }
        `}</style>
            </div>
        );
    }

    return (
        <div className="suggestions-list">
            <div className="suggestions-header">
                <h2 className="suggestions-title">👥 People to Meet</h2>
                <span className="suggestions-count">{suggestions.length} matches</span>
            </div>

            {suggestions.length === 0 ? (
                <div className="suggestions-empty">
                    <p>No suggestions available yet.</p>
                </div>
            ) : (
                <div className="suggestions-grid">
                    {suggestions.map((person) => (
                        <article key={person.id} className="person-card">
                            <div className="person-header">
                                <div className="person-avatar">{getInitials(person.name)}</div>
                                <div className="person-info">
                                    <h3 className="person-name">{person.name}</h3>
                                    <p className="person-role">{person.role}</p>
                                    <p className="person-company">{person.company}</p>
                                </div>
                                <div className="match-badge">{person.matchScore}%</div>
                            </div>

                            {person.sharedInterests.length > 0 && (
                                <div className="shared-interests">
                                    {person.sharedInterests.slice(0, 3).map((interest, idx) => (
                                        <span key={idx} className="interest-tag">{interest}</span>
                                    ))}
                                </div>
                            )}

                            <div className="icebreaker">
                                <span className="icebreaker-label">💬 Icebreaker</span>
                                <p className="icebreaker-text">{person.suggestedIcebreaker}</p>
                            </div>

                            {person.linkedInUrl && (
                                <a href={person.linkedInUrl} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                                    Connect on LinkedIn →
                                </a>
                            )}
                        </article>
                    ))}
                </div>
            )}

            <style jsx>{`
        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .suggestions-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .suggestions-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .suggestions-count {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .suggestions-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .person-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .person-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-strong);
        }

        .person-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .person-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), #F2A07B);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .person-info {
          flex: 1;
          min-width: 0;
        }

        .person-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .person-role {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .person-company {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
        }

        .match-badge {
          padding: 4px 10px;
          background: var(--success-light);
          color: var(--success);
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 100px;
        }

        .shared-interests {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .interest-tag {
          padding: 4px 10px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.75rem;
          border-radius: 100px;
        }

        .icebreaker {
          background: var(--accent-light);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
        }

        .icebreaker-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
          display: block;
          margin-bottom: 4px;
        }

        .icebreaker-text {
          font-size: 0.8125rem;
          color: var(--text-primary);
          line-height: 1.5;
          margin: 0;
        }

        .linkedin-link {
          display: inline-block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--accent);
          text-decoration: none;
        }

        .linkedin-link:hover {
          text-decoration: underline;
        }

        .suggestions-empty {
          text-align: center;
          padding: 48px 20px;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
}
