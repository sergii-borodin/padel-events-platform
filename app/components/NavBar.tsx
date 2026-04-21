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
          <Link href="/">Events</Link>
          <Link href="/">Rating</Link>
          <Link href="/">Market Place</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
