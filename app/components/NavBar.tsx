import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <p>PadelHub</p>
          <Image src={"/icons/logo.png"} alt="logo" width={24} height={24} />
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
