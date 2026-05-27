export interface NavLinkItemProps {
  link: { name: string; href: string };
  onNavigate?: () => void;
  variant?: 'default' | 'dropdown';
}

export interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export interface ServiceDropdownProps {
  open: boolean;
  onClose: () => void;
}

export interface SolutionsDropdownProps {
  open: boolean;
  onClose: () => void;
}

export interface NavigationInstanceProps {
  pathname: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  servicesOpen: boolean;
  setServicesOpen: (v: boolean) => void;
  solutionsOpen: boolean;
  setSolutionsOpen: (v: boolean) => void;
}