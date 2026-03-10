import { formatDate } from "../../../shared/lib/date";
import fallbackBannerImage from "../../../assets/image/web_Site_logo/Ceylon_Arena_Favicon.png";
import type { EventEntity } from "../types/event.types";

interface EventCardProps {
  event: EventEntity;
  onAction: (event: EventEntity) => void;
  actionLabel?: string;
  actionDisabled?: boolean;
  description?: string;
  onTitleClick?: (event: EventEntity) => void;
  onCardClick?: (event: EventEntity) => void;
  showBanner?: boolean;
}

const formatDateParts = (value?: string) => {
  if (!value) {
    return { day: "--", month: "---" };
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
  };
};

const EventCard = ({
  event,
  onAction,
  actionLabel = "Register",
  actionDisabled = false,
  description,
  onTitleClick,
  onCardClick,
  showBanner = false,
}: EventCardProps) => {
  const eventDate = formatDateParts(event.eventStartAt || event.registrationOpenAt);
  const resolvedDescription =
    description ?? `${event.gameName} | ${event.currency} ${event.entryFee} | ${event.maxTeams} Teams`;
  const bannerImage = event.bannerImage || fallbackBannerImage;

  return (
    <div
      className="event-card"
      onClick={onCardClick ? () => onCardClick(event) : undefined}
      onKeyDown={
        onCardClick
          ? (eventValue) => {
              if (eventValue.key === "Enter" || eventValue.key === " ") {
                eventValue.preventDefault();
                onCardClick(event);
              }
            }
          : undefined
      }
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
    >
      <div className="event-date">
        <span className="date-day">{eventDate.day}</span>
        <span className="date-month">{eventDate.month}</span>
      </div>

      <div className="event-info">
        {showBanner ? (
          <img
            src={bannerImage}
            alt={`${event.title} banner`}
            style={{
              width: "100%",
              maxHeight: "120px",
              objectFit: "cover",
              marginBottom: "12px",
              borderRadius: "8px",
            }}
          />
        ) : null}

        <h3
          style={onTitleClick ? { cursor: "pointer" } : undefined}
          onClick={
            onTitleClick
              ? (eventValue) => {
                  eventValue.stopPropagation();
                  onTitleClick(event);
                }
              : undefined
          }
        >
          {event.title}
        </h3>
        <p>{resolvedDescription}</p>

        <div className="event-tags">
          <span className="tag">{event.status}</span>
          <span className="tag">{formatDate(event.registrationCloseAt)}</span>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={(eventValue) => {
          eventValue.stopPropagation();
          onAction(event);
        }}
        disabled={actionDisabled}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EventCard;
