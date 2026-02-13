"use client";

import React, { useState, useEffect } from "react";
import { EventCard, EventCardProps } from "./EventCard";

interface EventFeedResponse {
    success: boolean;
    model: string;
    events: EventCardProps[];
    meta: {
        total: number;
        userId: string;
        generatedAt: string;
    };
    error?: string;
}

interface ADKPersonalizedEventFeedProps {
    interests?: string[];
    track?: string;
}

export function ADKPersonalizedEventFeed({
    interests = [],
    track,
}: ADKPersonalizedEventFeedProps) {
    const [events, setEvents] = useState<EventCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPersonalizedEvents() {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (interests.length > 0) {
                    params.set("interests", interests.join(","));
                }
                if (track) {
                    params.set("track", track);
                }

                const response = await fetch(`/api/ai/discover-events?${params.toString()}`);
                const data: EventFeedResponse = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch events");
                }

                setEvents(data.events);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchPersonalizedEvents();
    }, [interests, track]);

    if (loading) {
        return (
            <div className="feed-loading">
                <div className="feed-header-skeleton" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="card-skeleton" />
                ))}
                <style jsx>{`
          .feed-loading {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .feed-header-skeleton {
            height: 28px;
            width: 180px;
            background: var(--bg-secondary);
            border-radius: 8px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .card-skeleton {
            height: 140px;
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
            <div className="feed-error">
                <div className="error-icon">⚠️</div>
                <h3>Unable to Load Events</h3>
                <p>{error}</p>
                <style jsx>{`
          .feed-error {
            text-align: center;
            padding: 40px 20px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 16px;
          }
          .error-icon {
            font-size: 2rem;
            margin-bottom: 12px;
          }
          h3 {
            font-size: 1rem;
            color: var(--text-primary);
            margin-bottom: 8px;
          }
          p {
            font-size: 0.875rem;
            color: var(--text-secondary);
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="event-feed">
            <div className="feed-header">
                <h2 className="feed-title">📅 Your Events</h2>
                <span className="feed-count">{events.length} found</span>
            </div>

            {events.length === 0 ? (
                <div className="feed-empty">
                    <p>No events match your preferences yet.</p>
                </div>
            ) : (
                <div className="feed-list">
                    {events.map((event) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            )}

            <style jsx>{`
        .event-feed {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feed-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .feed-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .feed-count {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }

        .feed-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feed-empty {
          text-align: center;
          padding: 48px 20px;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
}
