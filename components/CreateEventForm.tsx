"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ApiResponse = {
  message: string;
  event?: { slug?: string };
  error?: string;
};

const CreateEventForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createdSlug, setCreatedSlug] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setCreatedSlug("");
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const tags = String(formData.get("tags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const agenda = String(formData.get("agenda") || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    formData.set("tags", JSON.stringify(tags));
    formData.set("agenda", JSON.stringify(agenda));

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        setStatus({
          type: "error",
          text: data.error || data.message || "Failed to create event",
        });
        return;
      }

      setCreatedSlug(data.event?.slug || "");
      setStatus({ type: "success", text: data.message || "Event created successfully" });
      form.reset();
    } catch {
      setStatus({ type: "error", text: "Network error while creating event" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="create-event-form">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Title
            <input name="title" required placeholder="Frontend Fusion Summit 2026" />
          </label>
          <label>
            Venue
            <input name="venue" required placeholder="Innovation Hub" />
          </label>
          <label>
            Location
            <input name="location" required placeholder="Kampala, Uganda" />
          </label>
          <label>
            Date
            <input name="date" type="date" required />
          </label>
          <label>
            Time
            <input name="time" required placeholder="10:30 AM" />
          </label>
          <label>
            Mode
            <select name="mode" defaultValue="online" required>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label>
            Audience
            <input name="audience" required placeholder="Frontend Developers" />
          </label>
          <label>
            Organizer
            <input name="organizer" required placeholder="NuruEvents Team" />
          </label>
        </div>

        <label>
          Overview
          <textarea name="overview" required rows={3} placeholder="Short summary of the event." />
        </label>

        <label>
          Description
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Full event description and details."
          />
        </label>

        <label>
          Tags (comma separated)
          <input name="tags" required placeholder="react,nextjs,design" />
        </label>

        <label>
          Agenda (one item per line)
          <textarea
            name="agenda"
            required
            rows={4}
            placeholder={"Opening keynote\nWorkshop\nQ&A"}
          />
        </label>

        <label>
          Event Banner
          <input name="image" type="file" accept="image/*" required />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>

      {status && (
        <p className={status.type === "success" ? "status-success" : "status-error"}>
          {status.text}
        </p>
      )}

      {createdSlug && (
        <Link href={`/events/${createdSlug}`} className="status-link">
          View created event
        </Link>
      )}
    </div>
  );
};

export default CreateEventForm;
