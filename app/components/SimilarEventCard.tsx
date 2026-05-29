import Image from "next/image";
import Link from "next/link";
import { formatCompactEventCardDate } from "@/lib/utils/eventDateFormatters";

interface Props {
  title: string;
  slug: string;
  image: string;
  location: string;
  date: Date | string;
}

const SimilarEventCard = ({ title, slug, image, location, date }: Props) => (
  <Link href={`/events/${slug}`} className="similar-event-card">
    <Image
      src={image}
      alt={title}
      width={112}
      height={80}
      className="thumb"
    />
    <div className="info">
      <p className="title">{title}</p>
      <p className="meta">
        {formatCompactEventCardDate(date)} · {location}
      </p>
    </div>
  </Link>
);

export default SimilarEventCard;
