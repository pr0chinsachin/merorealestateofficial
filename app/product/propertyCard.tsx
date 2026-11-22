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

const statusLabels: Record<string, string> = { Buy: "For sale", Rent: "For rent", UnderManagement: "Under management" };

export default function PropertyCard({ listing }: { listing: Listing }) {
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
        <span className={styles.badge}>{statusLabels[listing.propertyStatusValue] ?? listing.propertyStatusValue}</span>
      </div>
      <div className={styles.cardBody}>
        <h3>{listing.productName}</h3>
        <p className={styles.price}>{listing.price > 0 ? currency.format(listing.price) : "Contact agent"}</p>
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
