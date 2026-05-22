import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  slug: string;
  image: string;
  location: string;
  date: Date;
}

const formatDate = (date: Date): string =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

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
        {formatDate(date)} · {location}
      </p>
    </div>
  </Link>
);

export default SimilarEventCard;
