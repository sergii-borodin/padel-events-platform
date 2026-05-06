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
            <Link href="/api/events">Events</Link>
          </li>
          <li>
            <Link href="/">Rating</Link>
          </li>
          <li>
            <Link href="/">Market Place</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
