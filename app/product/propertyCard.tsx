import Image from "next/image";
import Link from "next/link";
import car from "../../public/car.svg";
import bath from "../../public/bathtub-bold-bathroom.svg";
import bed from "../../public/bed-bedroom-alt.svg";
import logo from "../../public/logo.png";
import SERVER_URL from "../urlConfig/serverUrl";
import styles from "./listing.module.css";

export interface Listing {
  id: string;
  productName: string;
  price: number;
  thumbnailImgPath: string | null;
  roomCount: number;
  bathRoomCount: number;
  parkingCount: number;
  propertyStatusValue: string;
  status: boolean;
  updatedDate: string;
}

const currency = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const badgeStyles = new Map([
  ["Buy", { label: "For sale", color: styles.forSale }],
  ["Sold", { label: "Sold", color: styles.sold }],
  ["Rent", { label: "For rent", color: styles.forRent }],
  ["Leased", { label: "Leased", color: styles.leased }],
  ["UnderManagement", { label: "Under management" }],
  ["OnLease", { label: "On lease" }],
]);

function highlight(text: string, searchTerm: string) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return text;

  const lower = text.toLowerCase();
  const parts = [];
  let start = 0;
  let match = lower.indexOf(term);
  while (match !== -1) {
    parts.push(text.slice(start, match), <mark key={match} className={styles.highlight}>{text.slice(match, match + term.length)}</mark>);
    start = match + term.length;
    match = lower.indexOf(term, start);
  }
  return [...parts, text.slice(start)];
}

export default function PropertyCard({
  listing, searchTerm = "", showStartingPrice = false,
}: { listing: Listing; searchTerm?: string; showStartingPrice?: boolean }) {
  const badge = badgeStyles.get(listing.propertyStatusValue);
  const amenities = [
    { icon: bed, label: "Bedrooms", count: listing.roomCount },
    { icon: bath, label: "Bathrooms", count: listing.bathRoomCount },
    { icon: car, label: "Car spaces", count: listing.parkingCount },
  ];
  return (
    <Link href={`/product/hotlistproduct/hotlistProductView/${listing.id}`} className={styles.card}>
      <div className={styles.cardMedia}>
        <Image
          src={listing.thumbnailImgPath ? `${SERVER_URL}${listing.thumbnailImgPath.replace(/~/g, "")}` : logo}
          alt=""
          fill
          unoptimized={Boolean(listing.thumbnailImgPath)}
          sizes="(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw"
          className={listing.thumbnailImgPath ? "object-cover" : "object-contain p-8"}
        />
        <span className={badge?.color ? `${styles.badge} ${badge.color}` : styles.badge}>
          {badge?.label ?? listing.propertyStatusValue}
        </span>
      </div>
      <div className={styles.cardBody}>
        <h3>{highlight(listing.productName, searchTerm)}</h3>
        <p className={styles.price}>
          {showStartingPrice && listing.price > 0 && listing.propertyStatusValue === "Buy" && (
            <span className={styles.priceLabel}>Starting from</span>
          )}
          {highlight(listing.price > 0 ? currency.format(listing.price) : "Contact agent", searchTerm)}
        </p>
        <ul className={styles.amenities}>
          {amenities.map(({ icon, label, count }) => (
            <li key={label}>
              <Image src={icon} alt="" width={19} height={19} />
              <span className="sr-only">{label}:</span> {count > 0 ? count : "–"}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
