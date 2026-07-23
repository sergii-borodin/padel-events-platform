import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <Image
            src={"/icons/logo-nav.png"}
            alt="UA Padel Denmark"
            width={40}
            height={48}
            priority
          />
          <p>PadelHub</p>
        </Link>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/create-event">Create event</Link>
          </li>
          <li>
            <Link href="/marketplace">Market Place</Link>
          </li>
          <li>
            <Link href="/rating">Rating</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
