"use client";

import React from "react";

export interface EventCardProps {
    id: string;
    title: string;
    description: string;
    startTime: string | Date;
    endTime: string | Date;
    location: string;
    track?: string;
    speakers?: string[];
    priorityScore?: number;
    priorityReason?: string;
}

export function EventCard({
    title,
    description,
    startTime,
    endTime,
    location,
    track,
    speakers,
    priorityScore,
    priorityReason,
}: EventCardProps) {
    const formatTime = (time: string | Date) => {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getMatchLevel = (score?: number) => {
        if (!score) return { label: "", color: "" };
        if (score >= 80) return { label: "Great Match", color: "var(--success)" };
        if (score >= 60) return { label: "Good Match", color: "var(--accent)" };
        return { label: "Suggested", color: "var(--text-muted)" };
    };

    const match = getMatchLevel(priorityScore);

    return (
        <article className="event-card">
            <div className="event-header">
                {track && <span className="event-track">{track}</span>}
                {priorityScore && priorityScore >= 60 && (
                    <span className="event-match" style={{ color: match.color }}>
                        {match.label}
                    </span>
                )}
            </div>

            <h3 className="event-title">{title}</h3>
            <p className="event-desc">{description}</p>

            {priorityReason && (
                <p className="event-reason">💡 {priorityReason}</p>
            )}

            <div className="event-meta">
                <div className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
                </div>
                <div className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{location}</span>
                </div>
            </div>

            {speakers && speakers.length > 0 && (
                <div className="event-speakers">
                    <span className="speaker-label">Speakers:</span>
                    <span className="speaker-names">{speakers.join(", ")}</span>
                </div>
            )}

            <style jsx>{`
        .event-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .event-card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--border-strong);
        }

        .event-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .event-track {
          display: inline-block;
          padding: 4px 10px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 100px;
        }

        .event-match {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .event-title {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .event-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .event-reason {
          font-size: 0.8125rem;
          color: var(--success);
          background: var(--success-light);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .meta-item svg {
          color: var(--text-muted);
        }

        .event-speakers {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8125rem;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }

        .speaker-label {
          color: var(--text-muted);
        }

        .speaker-names {
          color: var(--text-primary);
          font-weight: 500;
        }
      `}</style>
        </article>
    );
}
