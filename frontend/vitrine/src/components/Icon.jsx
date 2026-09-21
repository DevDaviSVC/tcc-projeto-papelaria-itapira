import { MdArrowBack, MdArrowForward, MdArrowOutward, MdAutoAwesome, MdCategory, MdClose, MdEdit, MdFavoriteBorder, MdHome, MdInventory2, MdLogout, MdMenu, MdPayments, MdStarOutline } from 'react-icons/md';

const icons = {
  arrow: MdArrowOutward, forward: MdArrowForward, back: MdArrowBack,
  sparkle: MdAutoAwesome, edit: MdEdit, heart: MdFavoriteBorder,
  home: MdHome, inventory: MdInventory2, category: MdCategory,
  logout: MdLogout, menu: MdMenu, close: MdClose, price: MdPayments, star: MdStarOutline,
};

export default function Icon({ name, className = '' }) {
  const Component = icons[name];
  return <Component className={`icon ${className}`} aria-hidden="true" focusable="false" />;
}
